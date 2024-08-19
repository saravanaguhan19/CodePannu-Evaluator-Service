import express, { Express } from "express";

import serverConfig from "./config/serverConfig";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import apiRouter from "./routes";
import SampleWorker from "./workers/SampleWorker";

const app: Express = express();

app.use("/api", apiRouter);

app.listen(serverConfig.PORT, () => {
  console.log(`Server started to listen at :${serverConfig.PORT}`);

  SampleWorker("SampleQueue");
  sampleQueueProducer("SampleJob", {
    name: "saravana",
    company: "Vetti",
    location: "chennai",
  });
});
