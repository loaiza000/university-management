import { Router } from "express";
import universidadController from "../controllers/universidadController.js";

const universidadRoutes = Router();

universidadRoutes.get("/", universidadController.getAll);
universidadRoutes.get("/:id", universidadController.getById);
universidadRoutes.post("/", universidadController.postUniversidad);
universidadRoutes.put("/:id", universidadController.putUniversidad);
universidadRoutes.delete("/:id", universidadController.deleteUniversidad);

// ** LISTAR UNIVERSIDAD POR NOMBRE
universidadRoutes.get("/nombre/:nombre", universidadController.getByName);

export default universidadRoutes;
