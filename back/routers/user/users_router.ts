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

router.post("/register", (req, res) => {
  const body: IRegisterUser = req.body;
  console.log(body);
  res.json({
    message: "create user",
  });
});

router.post("/login", (req, res) => {
  const body: ILoginUser = req.body;
  console.log(body);
  res.json({ message: "login success" });
});

export default router;
