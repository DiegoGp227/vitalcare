// routes.ts

import { Router } from "express";
import { processWebhookMessage } from "../../src/webhookLogic";

const router = Router();

// =======================================================
// === 📞 INTERFACES (Movidas aquí por ser específicas del cuerpo de las rutas)
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
// Se usa el handler importado de webhookLogic
router.post("/webhook", processWebhookMessage);


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