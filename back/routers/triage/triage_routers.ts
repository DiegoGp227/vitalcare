import { Router } from "express";
import axios from "axios";
import { vectorizeAllHistory } from "../../services/vectorization.service";

enum EstadoPaciente {
  EN_ESPERA = "en espera",
  EN_DIAGNOSTICO = "en diagnostico",
  EN_CONSULTA = "en consulta",
}

const router = Router();

interface routerProp {
  id: number;
}

const HASURA_GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_API || "https://main-hermit-36.hasura.app/v1/graphql";
const HASURA_ADMIN_SECRET =
  process.env.ADMIN_HASURA ||
  "IAQXSF0JRCFC2ylKMuD6ZNnzdhKc69iSbxwTuG9EWEdy1CsLYsrmPWzBpqhh14Bc";

router.get("/userBy/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const query = `
  query MyQuery($id : Int!) {
    paciente(where: { id: { _eq: $id } }){
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
        triage
        id
      }
    }
  }
  `;
  try {
    const response = await axios.post(
      HASURA_GRAPHQL_ENDPOINT,
      {
        query: query,
        variables: { id: id },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
        },
      }
    );
    res.json({
      data: response.data.data,
    });
  } catch {
    res.json({
      mgs: "mensaje",
    });
  }
});

interface ConstantesVitales {
  demo: boolean;
  estadoconciencia: string;
  frecuenciacardiacafc: number;
  frecuenciarespiratoriafr: number;
  pacienteid: number;
  peso: number;
  presionarterialpa: number;
  saturaciondeoxigeno: number;
  temperaturacorporal: number;
}

router.post("/data", async (req, res) => {
  const {
    demo,
    estadoconciencia,
    frecuenciacardiacafc,
    frecuenciarespiratoriafr,
    pacienteid,
    peso,
    presionarterialpa,
    saturaciondeoxigeno,
    temperaturacorporal,
  }: ConstantesVitales = req.body;

  // Generar fecha y hora actual
  const fechatoma = new Date().toISOString();

  const query = `
    mutation InsertConstantesVitales(
      $demo: Boolean!
      $estadoconciencia: String!
      $fechatoma: timestamp!
      $frecuenciacardiacafc: Float!
      $frecuenciarespiratoriafr: Float!
      $pacienteid: Int!
      $peso: Float!
      $presionarterialpa: Float!
      $saturaciondeoxigeno: Float!
      $temperaturacorporal: Float!
    ) {
      insert_constantesvitales_one(object: {
        demo: $demo
        estadoconciencia: $estadoconciencia
        fechatoma: $fechatoma
        frecuenciacardiacafc: $frecuenciacardiacafc
        frecuenciarespiratoriafr: $frecuenciarespiratoriafr
        pacienteid: $pacienteid
        peso: $peso
        presionarterialpa: $presionarterialpa
        saturaciondeoxigeno: $saturaciondeoxigeno
        temperaturacorporal: $temperaturacorporal
      }) {
        demo
        estadoconciencia
        fechatoma
        frecuenciacardiacafc
        frecuenciarespiratoriafr
        pacienteid
        peso
        saturaciondeoxigeno
        temperaturacorporal
        presionarterialpa
      }
    }
  `;

  try {
    const response = await axios.post(
      HASURA_GRAPHQL_ENDPOINT,
      {
        query: query,
        variables: {
          demo,
          estadoconciencia,
          fechatoma,
          frecuenciacardiacafc,
          frecuenciarespiratoriafr,
          pacienteid,
          peso,
          presionarterialpa,
          saturaciondeoxigeno,
          temperaturacorporal,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
        },
      }
    );

    await vectorizeAllHistory();

    if (response.data.errors) {
      return res.status(400).json({
        error: "GraphQL errors",
        details: response.data.errors,
      });
    }

    res.json({
      success: true,
      data: response.data.data,
    });
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Server error",
      message: error.message,
      details: error.response?.data,
    });
  }
});

router.get("/userState", async (req, res) => {
  const query = `
  query MyQuery {
    paciente {
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
    const response = await axios.post(
      HASURA_GRAPHQL_ENDPOINT,
      { query: query },
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

    res.json({
      data: response.data.data,
    });
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Server error",
      message: error.message,
      details: error.response?.data,
    });
  }
});

interface newStateProp {
  id_user: number;
  new_state: string;
  severity_level: number; // 1-5 según nivel de urgencia
  description?: string;
}

router.post("/newState", async (req, res) => {
  try {
    const { id_user, new_state, severity_level, description }: newStateProp =
      req.body;
    console.log("Insertando estado para usuario:", {
      id_user,
      new_state,
      severity_level,
    });

    // Validar que severity_level esté entre 1 y 5
    if (severity_level < 1 || severity_level > 5) {
      return res.status(400).json({
        error: "Validation error",
        message: "severity_level debe estar entre 1 y 5",
      });
    }

    const mutation = `
      mutation InsertEstadoPaciente(
        $pacienteid: Int!
        $severity_level: Int!
      ) {
        insert_estado_paciente_one(object: {
          pacienteid: $pacienteid
          severity_level: $severity_level
        }) {
          id
          pacienteid
          severity_level
          display_order
        }
      }
    `;

    const response = await axios.post(
      HASURA_GRAPHQL_ENDPOINT,
      {
        query: mutation,
        variables: {
          pacienteid: id_user,
          name: new_state,
          severity_level: severity_level,
          description: description || "",
        },
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

    res.json({
      success: true,
      data: response.data.data,
    });
  } catch (error: any) {
    console.error(
      "Error actualizando estado:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Server error",
      message: error.message,
      details: error.response?.data,
    });
  }
});

export default router;
