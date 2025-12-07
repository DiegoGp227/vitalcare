// app.ts
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

// Importar servicios y DB config
import { connectDB } from "./config/db.config";
import {
  initializeVectorizer,
  vectorizeAllHistory,
} from "./services/vectorization.service";

// routers
import user_router from "./routers/user/users_router.js";
import triage_router from "./routers/triage/triage_routers";

// - variables
const app = express();
const PORT = process.env.PORT || 3000;

// - middleware
// app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// router
app.use("/user", user_router);
app.use("/triage", triage_router);

// Health check endpoint para Docker
app.get("/ping", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
// - listen
app.listen(PORT, () => {
  console.log(`server init in port ${PORT} ...`);
});

// --- Inicialización del Servidor ---
async function startServer() {
  try {
    // 1. Conectar a la base de datos (UNA SOLA VEZ)
    await connectDB();

    // 2. Cargar el modelo de embeddings (UNA SOLA VEZ)
    await initializeVectorizer();

    // 3. Opcional: Ejecutar la vectorización de lote al inicio (puede ser lento)
    // Puedes comentarlo si solo quieres ejecutarlo bajo demanda o con un cron job externo.
    await vectorizeAllHistory();

    // 4. Iniciar el servidor HTTP
    app.listen(PORT, () => {
      console.log(`🌍 Servidor iniciado en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Fallo al iniciar la aplicación:", error);
    process.exit(1);
  }
}

startServer();
