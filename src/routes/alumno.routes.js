import { Router } from "express";
import alumnoController from "../controllers/alumnoController.js";
import { authClient } from "../middleware/auth.js";
import { validRoles } from "../constants/valid.roles.js";

const alumnoRoutes = Router();

alumnoRoutes.get(
  "/",
  authClient([validRoles.ADMINISTRADOR]),
  alumnoController.getAll
);
alumnoRoutes.get(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  alumnoController.getById
);
alumnoRoutes.post(
  "/",
  authClient([validRoles.ADMINISTRADOR]),
  alumnoController.postAlumno
);
alumnoRoutes.put(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  alumnoController.putAlumno
);
alumnoRoutes.delete(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  alumnoController.deleteAlumno
);

// ** LISTAR LOS ALUMNOS DE UNA UNIVERSIDAD ESPECIFICA
alumnoRoutes.get(
  "/alumnosUniversidad/:id",
  authClient([validRoles.ADMINISTRADOR]),
  alumnoController.listarUniEsp
);

// ** LISTAR LOS ALUMNOS QUE APROBARON UN CURSO EN PARTICULAR
alumnoRoutes.get(
  "/aprobados/:id",
  authClient([validRoles.ADMINISTRADOR]),
  alumnoController.alumnosAprobados
);

// ** LISTAR LOS ALUMNOS QUE NO APROBARON UN CURSO EN PARTICULAR
alumnoRoutes.get(
  "/desaprobados/:id",
  authClient([validRoles.ADMINISTRADOR]),
  alumnoController.alumnosDesaprobados
);

// ** CALCULAR LA CANTIDAD DE ALUMNOS MATRICULADOS UNI ESP
alumnoRoutes.get(
  "/alumnosMatriculados/:id",
  authClient([validRoles.ADMINISTRADOR]),
  alumnoController.cantidadAlumnosUniEsp
);

// ** BUSCAR ALUMNO CON LA NOTA MAS ALTA EN CURSO ESPECIFICO
alumnoRoutes.get(
  "/notaAlta/:id",
  authClient([validRoles.ADMINISTRADOR]),
  alumnoController.alumnosNotaCursoEsp
);

// ** BUSCAR ALUMNO CON LA NOTA MAS BAJA EN CURSO ESPECIFICO
alumnoRoutes.get(
  "/notaBaja/:id",
  authClient([validRoles.ADMINISTRADOR]),
  alumnoController.alumnosNotaBajaCursoEsp
);

export default alumnoRoutes;
