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

router.post("/", async (req, res) => {
  const { id }: routerProp = req.body;
  console.log(id);
  const query = `
  query MyQuery($id : Int!) {
    paciente(where: { id: { _eq: $id } }){
      apellido
      cedula
      id
      fechanacimiento
      contrase_a
      demo
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
    console.log(response);
    res.json({
      data: response.data.data,
    });
  } catch {
    res.json({
      mgs: "mensaje",
    });
  }
});

export default router;
