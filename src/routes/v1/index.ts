import express from "express";

import { pinkCheck } from "../../controllers/pingController";

const v1Router = express.Router();

v1Router.get("/ping", pinkCheck);

export default v1Router;
