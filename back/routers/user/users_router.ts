import { Router } from "express";
import axios from "axios";
import OpenAI from "openai";

const router = Router();

// =======================================================
// === ⚠️ CONFIGURACIÓN Y VARIABLES DE ENTORNO
// =======================================================
// Nota: Estas variables deben estar disponibles a través de process.env
const whatsappToken = process.env.WHATSAPP_TOKEN;
const phoneId = process.env.WHATSAPP_PHONE_ID;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// =======================================================
// === 💾 ESTADO DE LA CONVERSACIÓN Y MOCK
// =======================================================
/**
 * ESTADO DE LA CONVERSACIÓN: Actualizado con nuevos estados para el flujo médico.
 */
const userSessionState: {
    [key: string]: 'START' | 'ASKING_CEDULA' | 'ASKING_SYMPTOMS' | 'DONE' | 'REJECTED'
} = {};

/**
 * MOCK DE BASE DE DATOS: Simula que solo estas cédulas están registradas.
 * Se ha incluido el usuario de prueba 1023955260 - Esteban Meza Betancur.
 */
const MOCK_DB_CEDULAS = [
    "10101010",
    "20202020",
    "30303030",
    "1023955260" // ✅ Cédula del usuario de prueba
];

/**
 * Simula la verificación de la cédula en la base de datos y retorna el nombre.
 */
function verifyCedulaInDB(cedula: string): { isValid: boolean, name: string | null } {
    if (cedula === "1023955260") {
        return { isValid: true, name: "Esteban Meza Betancur" }; // 👈 Usuario de prueba
    }
    if (MOCK_DB_CEDULAS.includes(cedula)) {
         return { isValid: true, name: "Usuario Registrado" };
    }
    return { isValid: false, name: null };
}


// =======================================================
// === 📞 FUNCIONES AUXILIARES
// =======================================================

interface IRegisterUser {
    name: string,
    lasname: string
    email: string,
    password?: string,
    gender: string,
    indetification_number: number,
    date_of_birth: Date,
    phone_number: number,
    is_demo: boolean
}

interface ILoginUser {
    cc: number
}

// Enviar mensaje a WhatsApp
async function sendWhatsAppMessage(to: string, message: string) {
    if (!whatsappToken || !phoneId) {
        console.error("❌ Error: WHATSAPP_TOKEN o PHONE_ID no están configurados.");
        return;
    }

    // Aquí está el código de envío de Axios
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
 * Procesa el número de cédula, verifica el mock y establece el siguiente estado.
 */
async function processCedula(from: string, cedula: string) {
    console.log(`Cédula recibida de ${from}: ${cedula}`);

    const { isValid, name } = verifyCedulaInDB(cedula); // 👈 Usar la nueva función

    if (isValid) {
        // Cédula VÁLIDA: Pide síntomas
        userSessionState[from] = 'ASKING_SYMPTOMS';

        // Mensaje modificado para incluir el nombre del mock
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
// === 🤖 RUTAS DE AUTENTICACIÓN
// =======================================================

router.post("/register", (req, res) => {
    const body: IRegisterUser = req.body
    console.log(body);
    res.json({
        message: "create user"
    })
})


router.post("/login", (req, res) => {
    const body: ILoginUser = req.body
    console.log(body);
    res.json({ message: "login success" })
})


// =======================================================
// === 💬 RUTAS DEL WEBHOOK DE WHATSAPP
// =======================================================

// ----------------------------
// 1. WHATSAPP WEBHOOK POST (Recibir mensajes)
// ----------------------------
router.post("/webhook", async (req, res) => {
    try {
        const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
        if (!entry) return res.sendStatus(200);

        const from = entry.from;
        const userMessage = entry.text?.body || "";
        const currentState = userSessionState[from] || 'START';

        // --- LÓGICA DE ESTADO ---

        if (currentState === 'START') {
            // Primer mensaje: Saluda y pide la cédula
            const welcomeMessage = "¡Hola! Soy Paulo, tu asistente virtual. Para empezar, por favor, envíame tu **número de cédula** (documento de identidad).";

            await sendWhatsAppMessage(from, welcomeMessage);
            userSessionState[from] = 'ASKING_CEDULA';

        } else if (currentState === 'ASKING_CEDULA') {
            // Segundo mensaje: Recibe la cédula y la procesa (Mock DB)
            const cedula = userMessage.trim();

            // Validar que sean solo dígitos
            if (/^\d+$/.test(cedula)) {
                await processCedula(from, cedula); // Llamar a la función con el mock
            } else {
                const errorMessage = "El formato no es correcto. Por favor, ingresa solo los dígitos de tu número de cédula.";
                await sendWhatsAppMessage(from, errorMessage);
            }

        } else if (currentState === 'ASKING_SYMPTOMS') {
            // Tercer mensaje: Recibe los síntomas. (El nombre ya se obtuvo o se asume con la cédula)
            console.log(`Síntomas recibidos de ${from}: ${userMessage}`);

            // ⚠️ Aquí es donde deberías guardar 'userMessage' (Síntomas) en tu DB

            userSessionState[from] = 'DONE'; // Mover al estado final

            const confirmationMessage = `Gracias. Tu información ha sido enviada a nuestro personal médico. Puedes esperar en la sala, serás llamado pronto.`;
            await sendWhatsAppMessage(from, confirmationMessage);

        } else if (currentState === 'DONE') {
            // Estado Finalizado: Usa ChatGPT para responder a consultas generales
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
            // Estado Rechazado: El usuario no puede hacer nada más por chat.
            const rejectionReply = "Tu registro no fue encontrado. Por favor, acércate a la recepción.";
            await sendWhatsAppMessage(from, rejectionReply);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("❌ Error en webhook:", error);
        res.sendStatus(500);
    }
});

// ----------------------------
// 2. WHATSAPP VERIFICACIÓN GET (Conexión inicial con Meta)
// ----------------------------
router.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // EL TOKEN DEBE COINCIDIR CON EL CONFIGURADO EN META
    if (mode === "subscribe" && token === "verify_token_mio") {
        console.log("✅ Webhook verificado correctamente!");
        return res.status(200).send(challenge);
    }

    console.log("❌ Error de verificación. Token o modo incorrecto.");
    res.sendStatus(403);
});

export default router;
