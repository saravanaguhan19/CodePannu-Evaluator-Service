import bodyParser from "body-parser";
import express, { Express } from "express";

import bullBoardAdapter from "./config/bullBoardConfig";
import serverConfig from "./config/serverConfig";
import runPython from "./containers/runPythonDocker";
// import sampleQueueProducer from "./producers/sampleQueueProducer";
import apiRouter from "./routes";
import SampleWorker from "./workers/SampleWorker";

const app: Express = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use("/api", apiRouter);

app.use("/ui", bullBoardAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
  console.log(`Server started to listen at :${serverConfig.PORT}`);

  console.log("bull board running");

  SampleWorker("SampleQueue");
  // sampleQueueProducer(
  //   "SampleJob",
  //   {
  //     name: "saravana ",
  //     company: "Vetti",
  //     location: "chennai",
  //   },
  //   5
  // );

  // sampleQueueProducer(
  //   "SampleJob",
  //   {
  //     name: "saravana 2 priority",
  //     company: "Vetti ccc",
  //     location: "chennai cc",
  //   },
  //   2
  // );

  // const code = `x = input()
  // print("value of x:",x)
  // `;

  const code = `x=input()
y=input()
print("value of x:",x)
print("value of y:",y)  
`;

const inputCase = `100
200
`;


  runPython(code, inputCase
);
});
