import "dotenv/config";
import express from "express";
import morgan from "morgan";
// routers
import user_router from "./routers/user/users_router.js";
import symptoms_router from "./routers/symptoms/symptoms_routers";

// - variables
const app = express();
const PORT = process.env.PORT || 3000;

// - middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/ping", (_req, res) => {
  res.json({
    message: "pong",
  });
});
// router
app.use("/user", user_router);
app.use("/symptoms", symptoms_router);
// - listen
app.listen(PORT, () => {
  console.log(`server init in port ${PORT} ...`);
});
