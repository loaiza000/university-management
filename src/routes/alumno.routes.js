import { Router } from "express";
import alumnoController from "../controllers/alumnoController.js";

const alumnoRoutes = Router();

alumnoRoutes.get("/", alumnoController.getAll);
alumnoRoutes.get("/:id", alumnoController.getById);
alumnoRoutes.post("/", alumnoController.postAlumno);
alumnoRoutes.put("/:id", alumnoController.putAlumno);
alumnoRoutes.delete("/:id", alumnoController.deleteAlumno);

// ** LISTAR LOS ALUMNOS DE UNA UNIVERSIDAD ESPECIFICA
alumnoRoutes.get("/alumnosUniversidad/:id", alumnoController.listarUniEsp);

// ** LISTAR LOS ALUMNOS QUE APROBARON UN CURSO EN PARTICULAR
alumnoRoutes.get("/aprobados/:id", alumnoController.alumnosAprobados);

// ** LISTAR LOS ALUMNOS QUE NO APROBARON UN CURSO EN PARTICULAR
alumnoRoutes.get("/desaprobados/:id", alumnoController.alumnosDesaprobados);

// ** CALCULAR LA CANTIDAD DE ALUMNOS MATRICULADOS UNI ESP
alumnoRoutes.get(
  "/alumnosMatriculados/:id",
  alumnoController.cantidadAlumnosUniEsp
);

// ** BUSCAR ALUMNO CON LA NOTA MAS ALTA EN CURSO ESPECIFICO
alumnoRoutes.get("/notaAlta/:id", alumnoController.alumnosNotaCursoEsp);

// ** BUSCAR ALUMNO CON LA NOTA MAS BAJA EN CURSO ESPECIFICO
alumnoRoutes.get("/notaBaja/:id", alumnoController.alumnosNotaBajaCursoEsp);

export default alumnoRoutes;
