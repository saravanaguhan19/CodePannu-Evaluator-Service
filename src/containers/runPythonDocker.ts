// import Docker from "dockerode";

import { PYTHON_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";

async function runPython(code: string, inputTestCase: string) {
  console.log("Initialising a new python docker container");

  const rawLogBuffer: Buffer[] = [];

  await pullImage(PYTHON_IMAGE);

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
  )}' > test.py && echo '${inputTestCase.replace(
    /'/g,
    `'\\"`
  )}' | python3 test.py`;
  console.log(runCommand);

  const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
    "/bin/sh",
    "-c",
    runCommand,
  ]);

  // starting / booting the corresponding docker container
  await pythonDockerContainer.start();

  console.log("Started the docker container");

  const loggerStream = await pythonDockerContainer.logs({
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
      res(decodedStream);
    });
  });

  //remove the container when done with it
  await pythonDockerContainer.remove();
}

export default runPython;
