import express, { Express } from "express";

import serverConfig from "./config/serverConfig";



const app: Express = express();
const x = 1;

app.listen(serverConfig.PORT, () => {
  console.log(`Server started to listen at :${serverConfig.PORT}`);
  console.log("wow");
});
