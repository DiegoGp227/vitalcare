import { Router } from "express";
import axios from "axios";
import OpenAI from "openai";

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
  const { cc }: ILoginUser = req.body;
  console.log(cc);
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
  res.json({
    data: response.data.data,
  });
});

export default router;
