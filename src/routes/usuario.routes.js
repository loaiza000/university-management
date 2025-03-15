import { Router } from "express";
import usuarioController from "../controllers/usuarioController";
import { authClient } from "../middleware/auth";
import { validRoles } from "../constants/valid.roles";

const usuarioRouter = Router();

usuarioRouter.get(
  "/",
  authClient([validRoles.ADMINISTRADOR]),
  usuarioController.getAllUser
);
usuarioRouter.get(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  usuarioController.getUserById
);
usuarioRouter.post(
  "/",
  authClient([validRoles.ADMINISTRADOR]),
  usuarioController.postUser
);
usuarioRouter.put(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  usuarioController.updateUsuario
);
usuarioRouter.delete(
  "/:id",
  authClient([validRoles.ADMINISTRADOR]),
  usuarioController.deleteUser
);

// ** USER INACTIVOS
usuarioRouter.get(
  "/inactivos",
  authClient([validRoles.ADMINISTRADOR]),
  usuarioController.getUserInactivos
);

// ** USER ACTIVOS
usuarioRouter.get(
  "/inactivos",
  authClient([validRoles.ADMINISTRADOR]),
  usuarioController.getUserActivos
);

// ** LOGIN
usuarioRouter.post(
  "/login",
  authClient([validRoles.ADMINISTRADOR]),
  usuarioController.login
);

export default usuarioRouter;
