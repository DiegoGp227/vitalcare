import { Router } from "express";
import axios from "axios";
import OpenAI from "openai";
import { processWebhookMessage } from "../../src/webhookLogic";

const router = Router();

interface IRegisterUser {
  name: string;
  lasname: string;
  email: string;
  password?: string;
  gender: string;
  indetification_number: number;
  date_of_birth: Date;
  phone_number: number;
  is_demo: boolean;
}

interface ILoginUser {
  cc: number;
}

const HASURA_GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_API || "https://main-hermit-36.hasura.app/v1/graphql";
const HASURA_ADMIN_SECRET =
  process.env.ADMIN_HASURA ||
  "IAQXSF0JRCFC2ylKMuD6ZNnzdhKc69iSbxwTuG9EWEdy1CsLYsrmPWzBpqhh14Bc";

router.post("/register", (req, res) => {
  const body: IRegisterUser = req.body;
  console.log(body);
  res.json({
    message: "create user",
  });
});

router.post("/login", async (req, res) => {
  const query = `
  query MyQuery($cc : Int!) {
    paciente(where: { cedula: { _eq: $cc } }){
      apellido
      cedula
      id
      fechanacimiento
      direccion
      email
      genero
      sintomas {
        demo
        dolor
        fecha
        id
      }
    }
  }
  `;

  try {
    const { cc }: ILoginUser = req.body;
    console.log("Buscando usuario con cédula:", cc);

    const response = await axios.post(
      HASURA_GRAPHQL_ENDPOINT,
      {
        query: query,
        variables: { cc: cc },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
        },
      }
    );

    if (response.data.errors) {
      return res.status(400).json({
        error: "GraphQL errors",
        details: response.data.errors,
      });
    }

    // Verificar si se encontró el paciente
    if (response.data.data.paciente && response.data.data.paciente.length > 0) {
      res.json({
        success: true,
        data: response.data.data.paciente[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "El usuario no existe",
      });
    }
  } catch (error: any) {
    console.error("Error en login:", error.response?.data || error.message);
    res.status(500).json({
      error: "Server error",
      message: error.message,
      details: error.response?.data,
    });
  }
});

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

router.post("/reporteInfo", async (req, res) => {
  const payload: DiagnosePayload = {
    query: "cómo esta el paciente",
    patient_dni: "12345678",
  };
  const url = "https://wear-boston-valuable-ran.trycloudflare.com/diagnose";
  const response = await axios.post(url, payload, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  res.json({
    menssage: response.data,
  });
});

export default router;
