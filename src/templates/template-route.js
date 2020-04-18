import { Router } from "express";
import Controller from "../controllers/template";
const routes = Router();

/* CREATE */
routes.post("/", Controller.create);

/* READ */
routes.get("/", Controller.findAll);
routes.get("/:id", Controller.findOne);

/* UPDATE */
routes.patch("/:id", Controller.updateOnePatch);
routes.put("/:id", Controller.updateOnePut);

/* DELETE */
routes.delete("/:id", Controller.deleteOne);

export default routes;
