import { Router } from "express";
import notaController from "../controllers/notaController.js";
import { validRoles } from "../constants/valid.roles.js";
import { authClient } from "../middleware/auth.js";

const notaRoutes = Router();

notaRoutes.get(
  "/",
  authClient([validRoles.ADMINISTRADOR]),
  notaController.getAll
);
notaRoutes.get(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  notaController.getById
);
notaRoutes.post(
  "/",
  authClient([validRoles.ADMINISTRADOR]),
  notaController.postNota
);
notaRoutes.put(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  notaController.putNota
);
notaRoutes.delete(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  notaController.deleteNota
);

// ** LISTAR NOTAS DE UN ALUMNO POR IDENTIFICACION
notaRoutes.get(
  "/notasIdentificacion/:identificacion",
  authClient([validRoles.ADMINISTRADOR]),
  notaController.listarNotasPorIdentificacion
);

// ** LISTAR EL PROMEDIO DE NOTAS DE UN CURSO ESP
notaRoutes.get(
  "/promedioNotas/:id",
  authClient([validRoles.ADMINISTRADOR]),
  notaController.promedioNotas
);

// ** PROMEDIO DE NOTAS DE TODOS LOS ALUMNOS DE UNA UNIVERSIDAD
notaRoutes.get(
  "/promedioAlumnos/:id",
  authClient([validRoles.ADMINISTRADOR]),
  notaController.promedioUniversidad
);

export default notaRoutes;
