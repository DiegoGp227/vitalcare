import express from "express";

// - variables
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/ping", (_req, res) => {
  res.json({
    message: "pong",
  });
});

// - listen
app.listen(PORT, () => {
  console.log(`server init in port ${PORT} ...`);
});
