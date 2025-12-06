import express from "express";
import morgan from "morgan"
// - variables
const app = express();
const PORT = process.env.PORT || 3000;

// - midelware
app.use(morgan("dev"))

app.get("/ping", (_req, res) => {
  res.json({
    message: "pong",
  });
});

// - listen
app.listen(PORT, () => {
  console.log(`server init in port ${PORT} ...`);
});
