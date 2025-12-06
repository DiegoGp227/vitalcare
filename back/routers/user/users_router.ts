import Router from "express"
import axios from "axios";
import OpenAI from "openai";

const router = Router();


interface IRegisterUser {
  name : string,
  lasname : string
  email : string,
  password? : string,
  gender : string,
  indetification_number : number,
  date_of_birth : Date,
  phone_number : number,
  is_demo : boolean
}

interface ILoginUser {
  cc : number
}


router.post("/register", (req , res) => {
  const body : IRegisterUser = req.body
  console.log(body);
  res.json({
    message: "create user"
  })
})



router.post("/login" , (req, res) => {
  const body: ILoginUser = req.body
  console.log(body);

})

// ------------------------------------------------------
// *** NUEVA SECCIÓN: WHATSAPP + CHATGPT ***
// ------------------------------------------------------

const whatsappToken = process.env.WHATSAPP_TOKEN;
const phoneId = process.env.WHATSAPP_PHONE_ID;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enviar mensaje a WhatsApp
async function sendWhatsAppMessage(to: string, message: string) {
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

// ----------------------------
// WHATSAPP WEBHOOK POST
// ----------------------------
router.post("/whatsapp/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!entry) return res.sendStatus(200);

    const from = entry.from;
    const userMessage = entry.text?.body || "";

    // Enviar mensaje a ChatGPT
    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            `Eres un asistente llamado Paulo. Pide número de cédula y contraseña ` +
            `de forma diferente cada vez. No valides nada.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 1,
    });

    const reply: any = ai.choices[0].message.content;

    // Enviar a WhatsApp
    await sendWhatsAppMessage(from, reply);

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.sendStatus(500);
  }
});

// ----------------------------
// WHATSAPP VERIFICACIÓN GET
// ----------------------------
router.get("/whatsapp/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === "verify_token_mio") {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

export default router;
