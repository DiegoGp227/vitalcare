import { Router } from "express";
import axios from "axios";

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
    console.log(response.data.data);
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

// router.get("/userState", async (req, res) => {
//   const query = `
//   query MyQuery($id : Int!) {
//     paciente(where: { id: { _eq: $id } }){
//       apellido
//       cedula
//       id
//       fechanacimiento
//       direccion
//       email
//       genero
//       sintomas {
//         demo
//         dolor
//         fecha
//         id
//       }
//     }
//   }
//   `;

//   const response = await axios.get({ query: query });

//   res.json({
//     data: response.data.data,
//   });
// });

export default router;
