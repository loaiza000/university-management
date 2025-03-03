import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDb } from "./database.js";
import dotenv from "dotenv";

dotenv.config();
connectDb();

import universidadRoutes from "./routes/universidad.routes.js";
import profesorRoutes from "./routes/profesor.routes.js";
import notaRoutes from "./routes/nota.routes.js";
import cursoRoutes from "./routes/curso.routes.js";
import alumnoRoutes from "./routes/alumno.routes.js";

const app = express();

app.set("Port", process.env.PORT);
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/universidad", universidadRoutes);
app.use("/profesor", profesorRoutes);
app.use("/nota", notaRoutes);
app.use("/curso", cursoRoutes);
app.use("/alumno", alumnoRoutes);

app.listen(app.get("Port"), () => {
  console.log("Escuchando por el puerto", app.get("Port"));
});
