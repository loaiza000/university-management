import { Router } from "express";
import profesorController from "../controllers/profesorController.js";
const profesorRoutes = Router();

profesorRoutes.get("/", profesorController.getAll);
profesorRoutes.get("/:id", profesorController.getById);
profesorRoutes.post("/", profesorController.postProfesor);
profesorRoutes.put("/:id", profesorController.putProfesor);
profesorRoutes.delete("/:id", profesorController.deleteProfesor);

// ** LISTAR LOS PROFESORES DE UNA UNIVERSIDAD ESPECIFICA
profesorRoutes.get(
  "/profesorUniversidad/:id",
  profesorController.listarProfesoresUniEsp
);

// ** LISTAR LOS PROFESORES QUE IMPARTEN CURSOS EN LOS QUE ESTA UN ALUMNO ESPECIFICO
profesorRoutes.get(
  "/profesorAlumnos/:id",
  profesorController.profesoresCursosAlumnoEsp
);

export default profesorRoutes;
