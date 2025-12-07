// services/vectorization.service.ts

import { QueryResult } from 'pg';
import { pipeline } from '@xenova/transformers';
import { pool } from '../config/db.config';

const TARGET_TABLE = 'paciente';
const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';

let embeddingPipeline: any;

const GET_HISTORY_QUERY = `
    SELECT
        p.id AS patient_id,
        p.nombre,
        p.apellido,
        COALESCE(
            STRING_AGG(
                'Fecha: ' || TO_CHAR(cv.fechatoma, 'YYYY-MM-DD HH24:MI') || 
                ' | Frec. Cardíaca: ' || cv.frecuenciacardiacafc ||
                ' | Presión: ' || cv.presionarterialpa ||
                ' | Temp: ' || cv.temperaturacorporal ||
                ' | O2: ' || cv.saturaciondeoxigeno ||
                ' | Conciencia: ' || cv.estadoconciencia,
                E'\n--- ' ORDER BY cv.fechatoma DESC
            ), ''
        ) AS historial_vitales,

        COALESCE(
            STRING_AGG(
                'Fecha: ' || TO_CHAR(s.fecha, 'YYYY-MM-DD HH24:MI') ||
                ' | Dolor: ' || s.dolor ||
                ' | Zona: ' || s.zonadolor,
                E'\n--- ' ORDER BY s.fecha DESC
            ), ''
        ) AS historial_sintomas

    FROM paciente p
    LEFT JOIN constantesvitales cv ON p.id = cv.pacienteid
    LEFT JOIN sintomas s ON p.id = s.pacienteid
    GROUP BY p.id, p.nombre, p.apellido
    ORDER BY p.id;
`;

export async function initializeVectorizer(): Promise<void> {
    if (!embeddingPipeline) {
        console.log(`⏳ Cargando modelo de embeddings: ${EMBEDDING_MODEL}...`);
        embeddingPipeline = await pipeline('feature-extraction', EMBEDDING_MODEL);
        console.log(`✅ Modelo ${EMBEDDING_MODEL} cargado.`);
    }
}

export async function vectorizeAllHistory(): Promise<number> {
    console.log("--- INICIO DE VECTORIZACIÓN EN BATCH ---");

    if (!embeddingPipeline) {
        await initializeVectorizer();
    }

    let client;
    let processedCount = 0;

    try {
        client = await pool.connect();
        await client.query('SET search_path TO public, vector');

        const result: QueryResult = await client.query(GET_HISTORY_QUERY);
        const historiales = result.rows;

        console.log(`📄 ${historiales.length} pacientes encontrados.`);

        for (const registro of historiales) {
            const vitales = registro.historial_vitales || "No hay constantes vitales registradas.";
            const sintomas = registro.historial_sintomas || "No hay síntomas registrados.";

            // ✅ Texto enriquecido REAL que quedará en la DB
            const enrichedText = `
                Paciente ${registro.nombre} ${registro.apellido}.
                HISTORIAL COMPLETO:
                
                🔹 CONSTANTES VITALES:
                ${vitales}

                🔹 SÍNTOMAS:
                ${sintomas}
            `.trim();

            // Limpieza para embedding
            const cleanText = enrichedText.replace(/\s+/g, ' ');

            const output = await embeddingPipeline(cleanText, {
                pooling: 'mean',
                normalize: true
            });

            const vectorString = '[' + Array.from(output.data).join(',') + ']';

            const UPDATE_VECTOR_QUERY = `
                UPDATE ${TARGET_TABLE}
                SET paciente_vector = $2::vector,
                    historial_enriquecido_txt = $3
                WHERE id = $1;
            `;

            await client.query(UPDATE_VECTOR_QUERY, [
                registro.patient_id,
                vectorString,
                enrichedText
            ]);

            processedCount++;
        }

        console.log(`✅ COMPLETADO. Registros procesados: ${processedCount}`);
        return processedCount;

    } catch (error) {
        console.error("❌ ERROR vectorizando:", error);
        return 0;

    } finally {
        if (client) client.release();
    }
}
