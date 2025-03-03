import { Router } from "express";
import notaController from "../controllers/notaController.js";

const notaRoutes = Router();

notaRoutes.get("/", notaController.getAll);
notaRoutes.get("/:id", notaController.getById);
notaRoutes.post("/", notaController.postNota);
notaRoutes.put("/:id", notaController.putNota);
notaRoutes.delete("/:id", notaController.deleteNota);

// ** LISTAR NOTAS DE UN ALUMNO POR IDENTIFICACION
notaRoutes.get("/notasIdentificacion/:identificacion",notaController.listarNotasPorIdentificacion);

// ** LISTAR EL PROMEDIO DE NOTAS DE UN CURSO ESP
notaRoutes.get("/promedioNotas/:id", notaController.promedioNotas);

// ** PROMEDIO DE NOTAS DE TODOS LOS ALUMNOS DE UNA UNIVERSIDAD
notaRoutes.get("/promedioAlumnos/:id", notaController.promedioUniversidad);

export default notaRoutes;
