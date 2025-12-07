import { Router } from "express";
import axios from "axios";
const router = Router();

const HASURA_GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_API || "https://main-hermit-36.hasura.app/v1/graphql";
const HASURA_ADMIN_SECRET =
  process.env.ADMIN_HASURA ||
  "IAQXSF0JRCFC2ylKMuD6ZNnzdhKc69iSbxwTuG9EWEdy1CsLYsrmPWzBpqhh14Bc";

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const query = `
  query MyQuery {
    medico {
      id
      nombre
      especialidad
      disponi
    }
  }
  `;
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
  res.json({
    mgs: id,
  });
});

export default router;
