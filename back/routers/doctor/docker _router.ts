import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    mgs: "test",
  });
});

export default router;
