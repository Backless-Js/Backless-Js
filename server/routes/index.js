import { Router } from "express";
const routes = Router();
import routeGuard from "./routeGuard";
import authentication from "../middlewares/authentication";
/* Comment above text if you don't need to use authentication for your routes */

import userRoutes from "./user";
/* Comment above text if you don't need to use authentication for your routes */

//backless-route-source
/* Above comment should not be deleted in order for backless add route to work */

routes.get("/", (req,res,next) => res.status(200).json("Congrats Backless server are up and running ! 🎉🍻"))
routes.use(userRoutes);
routes.use(authentication);
/* Comment above text if you don't need to use authentication for your routes */

//backless-add-route
/* Above comment should not be deleted in order for backless add route to work */

routes.use(routeGuard);
/* Above syntax is route guard if route doesn't exist */

export default routes;
