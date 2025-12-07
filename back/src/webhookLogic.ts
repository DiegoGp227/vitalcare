// webhookLogic.ts

import axios from "axios";
import OpenAI from "openai";
import { Request, Response } from "express"; 

// =======================================================
// === ⚠️ CONFIGURACIÓN Y VARIABLES DE ENTORNO
// =======================================================
const whatsappToken = process.env.WHATSAPP_TOKEN;
const phoneId = process.env.WHATSAPP_PHONE_ID;

export const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
});

// =======================================================
// === 🌐 CONFIGURACIÓN HASURA
// =======================================================
export const HASURA_GRAPHQL_ENDPOINT = process.env.GRAPHQL_API || "https://main-hermit-36.hasura.app/v1/graphql";
export const HASURA_ADMIN_SECRET = process.env.ADMIN_HASURA || "IAQXSF0JRCFC2ylKMuD6ZNnzdhKc69iSbxwTuG9EWEdy1CsLYsrmPWzBpqhh14Bc";


// =======================================================
// === 💾 ESTADO DE LA CONVERSACIÓN (¡CORREGIDO: Guarda ID!)
// =======================================================
/**
 * ESTADO DE LA CONVERSACIÓN: Ahora almacena el ID del paciente.
 */
export const userSessionState: { 
    [key: string]: {
        state: 'START' | 'ASKING_CEDULA' | 'ASKING_SYMPTOMS' | 'DONE' | 'REJECTED',
        pacienteId?: string // ✅ Campo CORREGIDO para guardar el ID
    }
} = {};

// Función auxiliar para inicializar y obtener el estado
const getUserState = (from: string) => {
    if (!userSessionState[from]) {
        userSessionState[from] = { state: 'START' };
    }
    return userSessionState[from];
};


// =======================================================
// === 📞 FUNCIONES AUXILIARES Y LÓGICA HASURA
// =======================================================

/**
 * Consulta la API de Hasura para verificar la cédula.
 */
export async function fetchPacienteByCedula(cedula: string): Promise<{ isValid: boolean, name: string | null, id:any }> {
    const query = `
        query MyQuery {
            paciente(where: {cedula: {_eq: "${cedula}"}}) {
                cedula
                nombre
                apellido
                id
            }
        }
    `;

    try {
        const response = await axios.post(
            HASURA_GRAPHQL_ENDPOINT,
            { query: query },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-hasura-admin-secret': HASURA_ADMIN_SECRET, 
                },
            }
        );
        console.log(    "Respuesta de Hasura:", response.data);
        const pacientes = response.data.data.paciente;

        if (pacientes && pacientes.length > 0) {
            const user = pacientes[0];
            const fullName = `${user.nombre} ${user.apellido}`.trim();
            // Retorna el ID
            return { isValid: true, name: fullName, id: user.id }; 
        } else {
            return { isValid: false, name: null, id: null };
        }

    } catch (error: any) {
        console.error("❌ Error al consultar Hasura:", error.message || error);
        return { isValid: false, name: null, id: null };
    }
}


// Enviar mensaje a WhatsApp
export async function sendWhatsAppMessage(to: string, message: string) {
    if (!whatsappToken || !phoneId) {
        console.error("❌ Error: WHATSAPP_TOKEN o PHONE_ID no están configurados.");
        return;
    }

    return axios.post(
        `https://graph.facebook.com/v20.0/${phoneId}/messages`,
        {
            messaging_product: "whatsapp",
            to,
            text: { body: message },
        },
        {
            headers: {
                Authorization: `Bearer ${whatsappToken}`,
                "Content-Type": "application/json",
            },
        }
    );
}

/**
 * Procesa el número de cédula, llama a la API de Hasura y establece el siguiente estado.
 */
export async function processCedula(from: string, cedula: string) {
    console.log(`Cédula recibida de ${from}: ${cedula}`);

    const { isValid, name, id } = await fetchPacienteByCedula(cedula);

    if (isValid) {
        // Cédula VÁLIDA: Guarda el ID (en lugar de la cédula) y pide síntomas
        userSessionState[from] = {
            state: 'ASKING_SYMPTOMS',
            pacienteId: String(id) // ✅ CORRECCIÓN: Guardamos el ID del paciente aquí
        };

        const welcomeName = name ? `${name}, ` : 'Bienvenido, ';
        const nextMessage = `¡${welcomeName}hemos encontrado tu registro! Por favor, **describe brevemente tus síntomas** o el motivo de tu visita.`;

        await sendWhatsAppMessage(from, nextMessage);

    } else {
        // Cédula NO VÁLIDA: Rechaza y termina el flujo
        userSessionState[from] = { state: 'REJECTED' };
        const nextMessage = `Lo sentimos, tu número de cédula **${cedula}** no se encuentra en nuestra base de datos. Por favor, acércate a la recepción para ser asistido.`;
        await sendWhatsAppMessage(from, nextMessage);
    }
}

// ------------------------------------
// 🆕 FUNCIÓN 1: EXTRAER SÍNTOMAS CON LLM
// ------------------------------------

interface SymptomDetails {
    dolor: string;
    zonadolor: string;
}

/**
 * Usa OpenAI para extraer el síntoma principal y su zona de un texto libre.
 */
async function extractSymptomDetails(symptomsText: string): Promise<SymptomDetails> {
    try {
        const prompt = `Analiza el siguiente mensaje de un paciente sobre sus síntomas y extrae el síntoma principal y su ubicación (zona de dolor). Responde ÚNICAMENTE con un objeto JSON que siga este formato: {"dolor": "Descripción concisa del síntoma principal (ej: Fiebre, Dolor de cabeza)", "zonadolor": "Ubicación del dolor (ej: Cabeza, Abdomen, N/A)"}. Si no se menciona un dolor específico, usa 'Malestar general' en 'dolor' y 'N/A' en 'zonadolor'.
        
        Mensaje del paciente: "${symptomsText}"
        `;

        const ai = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Usamos un modelo que soporta bien el formato JSON
            messages: [
                { role: "system", content: "Eres un extractor de datos de síntomas médicos. Tu única tarea es devolver un objeto JSON válido según las instrucciones." },
                { role: "user", content: prompt },
            ],
            temperature: 0.1,
            response_format: { type: "json_object" }, // Forzamos la salida JSON
        });

        const jsonResponse = ai.choices[0].message.content;
        const result = JSON.parse(jsonResponse || '{}');
        
        return {
            dolor: result.dolor || 'Malestar general/No especificado',
            zonadolor: result.zonadolor || 'N/A'
        };

    } catch (error) {
        console.error("❌ Error en la extracción de síntomas con OpenAI:", error);
        return { dolor: 'Error de extracción', zonadolor: 'Error de extracción' };
    }
}

// ------------------------------------
// 🆕 FUNCIÓN 2: GUARDAR EN HASURA
// ------------------------------------

/**
 * Ejecuta la mutación para insertar los síntomas del paciente en Hasura.
 */
async function insertSintomaHasura(pacienteid: string, dolor: string, zonadolor: string) {
    // Generar fecha y hora actual en formato ISO 8601
    const fechaActual = new Date().toISOString(); 
    
    // Convertimos pacienteid (que ahora es el ID) a número
    const pacienteIdNum = parseInt(pacienteid, 10);
    if (isNaN(pacienteIdNum)) {
        console.error("❌ pacienteid no es un número válido. Valor:", pacienteid);
        return false;
    }

    // ✅ CORRECCIÓN CLAVE: ESCAPAR COMILLAS (simples y dobles) para que Hasura acepte el string
    const dolorEscapado = dolor.replace(/"/g, '\\"').replace(/'/g, "\\'");
    const zonadolorEscapado = zonadolor.replace(/"/g, '\\"').replace(/'/g, "\\'");

    const mutation = `
        mutation InsertSintoma {
            insert_sintomas_one(object: {
                demo: true,
                dolor: "${dolorEscapado}", 
                fecha: "${fechaActual}",
                pacienteid: ${pacienteIdNum}, 
                zonadolor: "${zonadolorEscapado}" 
                            }) {
                id
            }
        }
    `;
console.log("Ejecutando mutación Hasura:", mutation);
    try {
        const response = await axios.post(
            HASURA_GRAPHQL_ENDPOINT,
            { query: mutation },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
                },
            }
        );
        
        // ❌ Si hay errores de GraphQL, lanzamos uno para que caiga en el catch y lo registre
        if (response.data.errors) {
             throw new Error(`Error GraphQL: ${response.data.errors[0].message}`);
        }

        // ✅ CORRECCIÓN del log: Accedemos directamente al ID sin signos '?'
        console.log("✅ Síntoma insertado en Hasura. ID:", response.data.data.insert_sintomas_one.id);
        return true;
    } catch (error: any) {
        // Mostramos el error detallado (incluyendo el error GraphQL si lo hubo)
        console.error("❌ Error al insertar síntoma en Hasura:", error.message || error);
        return false;
    }
}


// =======================================================
// === 💬 HANDLER PRINCIPAL DEL WEBHOOK (¡ACTUALIZADO!)
// =======================================================

/**
 * Handler principal para procesar mensajes entrantes del Webhook de WhatsApp.
 */
export async function processWebhookMessage(req: Request, res: Response) {
    try {
        const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
        if (!entry) return res.sendStatus(200);

        const from = entry.from;
        const userMessage = entry.text?.body || "";
        const userSession = getUserState(from);
        const currentState = userSession.state;

        // --- LÓGICA DE ESTADO ---

        if (currentState === 'START') {
            const welcomeMessage = "¡Hola! Soy Paulo, tu asistente virtual. Para empezar, por favor, envíame tu **número de cédula** (documento de identidad).";

            await sendWhatsAppMessage(from, welcomeMessage);
            userSession.state = 'ASKING_CEDULA';

        } else if (currentState === 'ASKING_CEDULA') {
            const cedula = userMessage.trim();

            if (/^\d+$/.test(cedula)) {
                await processCedula(from, cedula); 
            } else {
                const errorMessage = "El formato no es correcto. Por favor, ingresa solo los dígitos de tu número de cédula.";
                await sendWhatsAppMessage(from, errorMessage);
            }

        } else if (currentState === 'ASKING_SYMPTOMS') {
            console.log(`Síntomas recibidos de ${from}: ${userMessage}`);
            
            // 1. Obtener el ID del paciente guardado previamente
            const pacienteid = userSession.pacienteId; // ✅ CORRECCIÓN: Buscamos pacienteId

            if (!pacienteid) {
                await sendWhatsAppMessage(from, "Error: No se encontró tu registro de cédula. Por favor, comienza de nuevo con tu número de identificación.");
                userSession.state = 'REJECTED';
            } else {
                // 2. Extraer detalles con OpenAI
                const { dolor, zonadolor } = await extractSymptomDetails(userMessage);

                // 3. Insertar en Hasura
                const success = await insertSintomaHasura(pacienteid, dolor, zonadolor);

                if (success) {
                    userSession.state = 'DONE';
                    const confirmationMessage = `Gracias. Tu información (${dolor} - ${zonadolor}) ha sido enviada a nuestro personal médico. Puedes esperar en la sala, serás llamado pronto.`;
                    await sendWhatsAppMessage(from, confirmationMessage);
                } else {
                    userSession.state = 'REJECTED';
                    await sendWhatsAppMessage(from, "Lo sentimos, hubo un error al guardar tus síntomas. Por favor, acércate a la recepción para ser asistido.");
                }
            }


        } else if (currentState === 'DONE') {
            console.log(`Mensaje de ${from} (DONE): ${userMessage}`);

            const ai = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                   { role: "system", content: "Eres Paulo, un asistente. El usuario ya se registró en recepción. Responde a sus consultas de forma útil."},
                   { role: "user", content: userMessage },
                ],
                temperature: 0.7,
            });

            const reply: any = ai.choices[0].message.content;
            await sendWhatsAppMessage(from, reply);

        } else if (currentState === 'REJECTED') {
            const rejectionReply = "Tu registro no fue encontrado. Por favor, acércate a la recepción.";
            await sendWhatsAppMessage(from, rejectionReply);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("❌ Error en webhook:", error);
        res.sendStatus(500);
    }
}