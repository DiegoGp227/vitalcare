// webhookLogic.ts

import axios from "axios";
import OpenAI from "openai";
import { Request, Response } from "express"; // Importamos tipos para el handler

// =======================================================
// === ⚠️ CONFIGURACIÓN Y VARIABLES DE ENTORNO
// =======================================================
const whatsappToken = process.env.WHATSAPP_TOKEN;
const phoneId = process.env.WHATSAPP_PHONE_ID;

export const openai = new OpenAI({ // Exportamos la instancia si se necesita en otro lugar
    apiKey: process.env.OPENAI_API_KEY,
});

// =======================================================
// === 🌐 CONFIGURACIÓN HASURA
// =======================================================
export const HASURA_GRAPHQL_ENDPOINT = process.env.GRAPHQL_API || "https://main-hermit-36.hasura.app/v1/graphql";
export const HASURA_ADMIN_SECRET = process.env.ADMIN_HASURA || "IAQXSF0JRCFC2ylKMuD6ZNnzdhKc69iSbxwTuG9EWEdy1CsLYsrmPWzBpqhh14Bc";


// =======================================================
// === 💾 ESTADO DE LA CONVERSACIÓN
// =======================================================
/**
 * ESTADO DE LA CONVERSACIÓN: Actualizado con nuevos estados para el flujo médico.
 */
export const userSessionState: { // Exportamos el estado de la sesión
    [key: string]: 'START' | 'ASKING_CEDULA' | 'ASKING_SYMPTOMS' | 'DONE' | 'REJECTED'
} = {};


// =======================================================
// === 📞 FUNCIONES AUXILIARES Y LÓGICA HASURA
// =======================================================

/**
 * Consulta la API de Hasura para verificar la cédula.
 */
export async function fetchPacienteByCedula(cedula: string): Promise<{ isValid: boolean, name: string | null }> {
    const query = `
        query MyQuery {
            paciente(where: {cedula: {_eq: "${cedula}"}}) {
                cedula
                nombre
                apellido
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

        const pacientes = response.data.data.paciente;

        if (pacientes && pacientes.length > 0) {
            const user = pacientes[0];
            const fullName = `${user.nombre} ${user.apellido}`.trim();
            return { isValid: true, name: fullName };
        } else {
            return { isValid: false, name: null };
        }

    } catch (error: any) {
        console.error("❌ Error al consultar Hasura:", error.message || error);
        return { isValid: false, name: null };
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

    const { isValid, name } = await fetchPacienteByCedula(cedula);

    if (isValid) {
        // Cédula VÁLIDA: Pide síntomas
        userSessionState[from] = 'ASKING_SYMPTOMS';

        const welcomeName = name ? `${name}, ` : 'Bienvenido, ';
        const nextMessage = `¡${welcomeName}hemos encontrado tu registro! Por favor, **describe brevemente tus síntomas** o el motivo de tu visita.`;

        await sendWhatsAppMessage(from, nextMessage);

    } else {
        // Cédula NO VÁLIDA: Rechaza y termina el flujo
        userSessionState[from] = 'REJECTED';
        const nextMessage = `Lo sentimos, tu número de cédula **${cedula}** no se encuentra en nuestra base de datos. Por favor, acércate a la recepción para ser asistido.`;
        await sendWhatsAppMessage(from, nextMessage);
    }
}


// =======================================================
// === 💬 HANDLER PRINCIPAL DEL WEBHOOK
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
        const currentState = userSessionState[from] || 'START';

        // --- LÓGICA DE ESTADO ---

        if (currentState === 'START') {
            const welcomeMessage = "¡Hola! Soy Paulo, tu asistente virtual. Para empezar, por favor, envíame tu **número de cédula** (documento de identidad).";

            await sendWhatsAppMessage(from, welcomeMessage);
            userSessionState[from] = 'ASKING_CEDULA';

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

            userSessionState[from] = 'DONE';

            const confirmationMessage = `Gracias. Tu información ha sido enviada a nuestro personal médico. Puedes esperar en la sala, serás llamado pronto.`;
            await sendWhatsAppMessage(from, confirmationMessage);

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