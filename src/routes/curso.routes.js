import { Router } from "express";
import cursoController from "../controllers/cursoController.js";
import { validRoles } from "../constants/valid.roles.js";
import { authClient } from "../middleware/auth.js";

const cursoRoutes = Router();

cursoRoutes.get(
  "/",
  authClient([validRoles.ADMINISTRADOR]),
  cursoController.getAll
);
cursoRoutes.get(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  cursoController.getById
);
cursoRoutes.post(
  "/",
  authClient([validRoles.ADMINISTRADOR]),
  cursoController.postCurso
);
cursoRoutes.put(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  cursoController.postCurso
);
cursoRoutes.delete(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  cursoController.deleteCurso
);

// ** LISTAR LOS CURSOS DE UN PROFESOR POR IDENTIFICACION
cursoRoutes.get(
  "/cursosProfesor/:identificacion",
  authClient([validRoles.ADMINISTRADOR]),
  cursoController.listarCursoIdentificacion
);

// ** LISTAR LOS CURSOS DE UNA UNIVERSIDAD ESPECIFICA
cursoRoutes.get(
  "/cursoUniversidad/:id",
  authClient([validRoles.ADMINISTRADOR]),
  cursoController.cursosUniEsp
);

// ** LISTAR LOS CURSOS DE UN ALUMNO
cursoRoutes.get(
  "/cursoAlumno/:id",
  authClient([validRoles.ADMINISTRADOR]),
  cursoController.listarCursoDeAlumno
);

// ** LISTAR LOS CURSOS EN LOS QUE UN PROFESOR ESPECIFICO ESTA ASIGNADO
cursoRoutes.get(
  "/cursoAsignadoProfesor/:id",
  authClient([validRoles.ADMINISTRADOR]),
  cursoController.cursoProfesorEsp
);

// ** LISTAR LOS CURSOS DONDE ALUMNO ESP TIENE NOTA MAYOR A 3
cursoRoutes.get(
  "/alumnoNota/:id",
  authClient([validRoles.ADMINISTRADOR]),
  cursoController.cursosAlumnoEspNotaMayor
);

// ** CALCULAR LA CANTIDAD DE CURSOS OFRECIDO POR UNA UNIVERSIDAD ESP
cursoRoutes.get(
  "/cursosOfrecidos/:id",
  authClient([validRoles.ADMINISTRADOR]),
  cursoController.cursosUniEsp
);

export default cursoRoutes;
