import { Router } from "express";
import cursoController from "../controllers/cursoController.js";

const cursoRoutes = Router();

cursoRoutes.get("/", cursoController.getAll);
cursoRoutes.get("/:id", cursoController.getById);
cursoRoutes.post("/", cursoController.postCurso);
cursoRoutes.put("/:id", cursoController.postCurso);
cursoRoutes.delete("/:id", cursoController.deleteCurso);

// ** LISTAR LOS CURSOS DE UN PROFESOR POR IDENTIFICACION
cursoRoutes.get(
  "/cursosProfesor/:identificacion",
  cursoController.listarCursoIdentificacion
);

// ** LISTAR LOS CURSOS DE UNA UNIVERSIDAD ESPECIFICA
cursoRoutes.get("/cursoUniversidad/:id", cursoController.cursosUniEsp);

// ** LISTAR LOS CURSOS DE UN ALUMNO
cursoRoutes.get("/cursoAlumno/:id", cursoController.listarCursoDeAlumno);

// ** LISTAR LOS CURSOS EN LOS QUE UN PROFESOR ESPECIFICO ESTA ASIGNADO
cursoRoutes.get("/cursoAsignadoProfesor/:id", cursoController.cursoProfesorEsp);

// ** LISTAR LOS CURSOS DONDE ALUMNO ESP TIENE NOTA MAYOR A 3
cursoRoutes.get("/alumnoNota/:id", cursoController.cursosAlumnoEspNotaMayor)

// ** CALCULAR LA CANTIDAD DE CURSOS OFRECIDO POR UNA UNIVERSIDAD ESP
cursoRoutes.get("/cursosOfrecidos/:id", cursoController.cursosUniEsp)

export default cursoRoutes;
