import { Router } from "express";
const routes = Router();
import UserController from "../controllers/user";

routes.post("/register", UserController.register);
routes.post("/login", UserController.login);

export default routes;
