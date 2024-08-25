// import Docker from "dockerode";

import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

async function runJava(code: string, inputTestCase: string) {
  console.log("Initialising a new java docker container");

  const rawLogBuffer: Buffer[] = [];

  // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
  //   "python3",
  //   "-c",
  //   code,
  //   "stty -echo",
  // ]);

  //echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py

  const runCommand = `echo '${code.replace(
    /'/g,
    `'\\"`
  )}' > Main.java && javac Main.java && echo '${inputTestCase.replace(
    /'/g,
    `'\\"`
  )}' | java Main`;
  console.log(runCommand);

  const javaDockerContainer = await createContainer(JAVA_IMAGE, [
    "/bin/sh",
    "-c",
    runCommand,
  ]);

  // starting / booting the corresponding docker container
  await javaDockerContainer.start();

  console.log("Started the docker container");

  const loggerStream = await javaDockerContainer.logs({
    stdout: true,
    stderr: true,
    timestamps: false,
    follow: true, //whether the logs are streamed or returned as string
  });

  loggerStream.on("data", (chunk) => {
    rawLogBuffer.push(chunk);
  });

  await new Promise((res) => {
    loggerStream.on("end", () => {
      console.log(rawLogBuffer);
      const completeBuffer = Buffer.concat(rawLogBuffer);
      const decodedStream = decodeDockerStream(completeBuffer);
      console.log(decodedStream);
      console.log(decodedStream.stdout);
      
      res(decodedStream);
    });
  });

  //remove the container when done with it
  await javaDockerContainer.remove();
}

export default runJava;
