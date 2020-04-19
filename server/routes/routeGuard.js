import { Router } from "express";
const routes = Router();
const err = {
  status: 404,
  message: "Page not found 404",
};

routes.get("/*", (req, res, next) => {
  next(err);
});
routes.post("/*", (req, res, next) => {
  next(err);
});
routes.put("/*", (req, res, next) => {
  next(err);
});
routes.patch("/*", (req, res, next) => {
  next(err);
});
routes.delete("/*", (req, res, next) => {
  next(err);
});

export default routes;
