// services/vectorization.service.ts

import { QueryResult } from 'pg';
import { pipeline } from '@xenova/transformers';
import { pool } from '../config/db.config'; // <-- Importamos el pool existente
// Se asume que 'paciente' es la tabla que vamos a actualizar
const TARGET_TABLE = 'paciente'; 
const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';

let embeddingPipeline: any;

/**
 * Consulta SQL para obtener el historial enriquecido (JOIN y agregación).
 */
const GET_HISTORY_QUERY = `
    SELECT
    p.id AS patient_id,
    p.nombre,
    p.apellido,
    -- 1. Agregación de Constantes Vitales
    COALESCE(
        STRING_AGG(
            'Fecha: ' || TO_CHAR(cv.fechatoma, 'YYYY-MM-DD HH24:MI') || 
            ' | Frecuencia Cardíaca: ' || cv.frecuenciacardiacafc || -- <--- ¡CORRECCIÓN APLICADA!
            ' | Presión: ' || cv.presionarterialpa || 
            ' | Temperatura: ' || cv.temperaturacorporal ||
            ' | Saturación O2: ' || cv.saturaciondeoxigeno ||
            ' | Estado Conciencia: ' || cv.estadoconciencia
            , E'\n--- ' ORDER BY cv.fechatoma DESC
        ), ''
    ) AS historial_vitales,
    -- 2. Agregación de Síntomas
    COALESCE(
        STRING_AGG(
            'Fecha: ' || TO_CHAR(s.fecha, 'YYYY-MM-DD HH24:MI') || 
            ' | Dolor: ' || s.dolor || 
            ' | Zona: ' || s.zonadolor
            , E'\n--- ' ORDER BY s.fecha DESC
        ), ''
    ) AS historial_sintomas
FROM 
    paciente p
LEFT JOIN 
    constantesvitales cv ON p.id = cv.pacienteid
LEFT JOIN 
    sintomas s ON p.id = s.pacienteid
-- Puedes descomentar la línea de abajo para probar el resultado con un paciente específico
-- WHERE p.id = 1 
GROUP BY 
    p.id, p.nombre, p.apellido
ORDER BY 
    p.id;`;

/**
 * Inicializa el modelo de embeddings (Debe ejecutarse una sola vez al inicio del servidor).
 */
export async function initializeVectorizer(): Promise<void> {
    if (!embeddingPipeline) {
        console.log(`⏳ Cargando modelo de embeddings: ${EMBEDDING_MODEL}...`);
        embeddingPipeline = await pipeline('feature-extraction', EMBEDDING_MODEL); 
        console.log(`✅ Modelo ${EMBEDDING_MODEL} cargado.`);
    }
}

/**
 * Vectoriza todo el historial clínico y actualiza la tabla 'paciente'.
 * @returns El número de registros procesados.
 */
export async function vectorizeAllHistory(): Promise<number> {
    console.log("--- INICIO DE VECTORIZACIÓN EN BATCH ---");
    let client;
    let processedCount = 0;

    // Aseguramos que el modelo esté cargado antes de vectorizar
    if (!embeddingPipeline) {
        await initializeVectorizer();
    }

    try {
        // Usar el pool para obtener un cliente de conexión
        client = await pool.connect();
        await client.query('SET search_path TO public, vector'); 

        const result: QueryResult = await client.query(GET_HISTORY_QUERY);
        console.log(result.rows);
        const historiales = result.rows;
        
        console.log(`📄 Encontrados ${historiales.length} pacientes para vectorizar.`);

        for (const registro of historiales) {
            // ... (Lógica de concatenación idéntica a la anterior)
            const vitales = registro.historial_vitales || "No hay constantes vitales registradas.";
            const sintomas = registro.historial_sintomas || "No hay síntomas registrados.";
            
            const textToEmbed = `
                Paciente ID: ${registro.patient_id}. Nombre: ${registro.nombre} ${registro.apellido}. 
                **HISTORIAL DE CONSTANTES VITALES:** ${vitales}.
                **HISTORIAL DE SÍNTOMAS:** ${sintomas}.
            `.trim().replace(/\s+/g, ' ');

            // Generar el vector
            const output = await embeddingPipeline(textToEmbed, { pooling: 'mean', normalize: true });
            const vectorString = '[' + Array.from(output.data).join(',') + ']'; 
            
            // Actualizar la tabla 'paciente'
            const UPDATE_VECTOR_QUERY = `
                UPDATE ${TARGET_TABLE}
                SET paciente_vector = $2::vector
                WHERE id = $1;
            `;

            await client.query(UPDATE_VECTOR_QUERY, [
                registro.patient_id, 
                vectorString
            ]);
            
            processedCount++;
        }
        
        console.log(`✅ PROCESO COMPLETADO. Registros vectorizados: ${processedCount}`);
        return processedCount;

    } catch (error) {
        console.error('\n❌ ERROR en el proceso de vectorización:', error);
        return 0;
    } finally {
        if (client) {
            client.release(); // Liberar el cliente al pool
        }
    }
}