import { Router } from "express";
import universidadController from "../controllers/universidadController.js";
import { authClient } from "../middleware/auth.js";
import { validRoles } from "../constants/valid.roles.js";

const universidadRoutes = Router();

universidadRoutes.get(
  "/",
  authClient([validRoles.ADMINISTRADOR]),
  universidadController.getAll
);
universidadRoutes.get(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  universidadController.getById
);
universidadRoutes.post(
  "/",
  authClient([validRoles.ADMINISTRADOR]),
  universidadController.postUniversidad
);
universidadRoutes.put(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  universidadController.putUniversidad
);
universidadRoutes.delete(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  universidadController.deleteUniversidad
);

// ** LISTAR UNIVERSIDAD POR NOMBRE
universidadRoutes.get(
  "/nombre/:nombre",
  authClient([validRoles.ADMINISTRADOR]),
  universidadController.getByName
);

export default universidadRoutes;
