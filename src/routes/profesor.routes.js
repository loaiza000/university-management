import { Router } from "express";
import profesorController from "../controllers/profesorController.js";
import { authClient } from "../middleware/auth.js";
import { validRoles } from "../constants/valid.roles.js";
const profesorRoutes = Router();

profesorRoutes.get(
  "/",
  authClient([validRoles.ADMINISTRADOR]),
  profesorController.getAll
);
profesorRoutes.get(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  profesorController.getById
);
profesorRoutes.post(
  "/",
  authClient([validRoles.ADMINISTRADOR]),
  profesorController.postProfesor
);
profesorRoutes.put(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  profesorController.putProfesor
);
profesorRoutes.delete(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  profesorController.deleteProfesor
);

// ** LISTAR LOS PROFESORES DE UNA UNIVERSIDAD ESPECIFICA
profesorRoutes.get(
  "/profesorUniversidad/:id",
  authClient([validRoles.ADMINISTRADOR]),
  profesorController.listarProfesoresUniEsp
);

// ** LISTAR LOS PROFESORES QUE IMPARTEN CURSOS EN LOS QUE ESTA UN ALUMNO ESPECIFICO
profesorRoutes.get(
  "/profesorAlumnos/:id",
  authClient([validRoles.ADMINISTRADOR]),
  profesorController.profesoresCursosAlumnoEsp
);

export default profesorRoutes;
