// import Docker from "dockerode";

import {
  CodeExecutorStrategy,
  ExecutionResponse,
} from "../types/CodeExecutorStrategy";
import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";

class CppExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string
  ): Promise<ExecutionResponse> {
    console.log(code, inputTestCase, outputTestCase);

    console.log("Initialising a new Cpp docker container");

    const rawLogBuffer: Buffer[] = [];

    await pullImage(CPP_IMAGE);

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
    )}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(
      /'/g,
      `'\\"`
    )}' | stdbuf -oL -eL ./main`;
    console.log(runCommand);

    const cppDockerContainer = await createContainer(CPP_IMAGE, [
      "/bin/sh",
      "-c",
      runCommand,
    ]);

    // starting / booting the corresponding docker container
    await cppDockerContainer.start();

    console.log("Started the docker container");

    const loggerStream = await cppDockerContainer.logs({
      stdout: true,
      stderr: true,
      timestamps: false,
      follow: true, //whether the logs are streamed or returned as string
    });

    loggerStream.on("data", (chunk) => {
      rawLogBuffer.push(chunk);
    });

    try {
      const codeResponse: string = await this.fetchDecodedStream(
        loggerStream,
        rawLogBuffer
      );
      return { output: codeResponse, status: "COMPLETED" };
    } catch (error) {
      return { output: error as string, status: "ERROR" };
    } finally {
      //remove the container when done with it
      await cppDockerContainer.remove();
    }
  }

  fetchDecodedStream(
    loggerStream: NodeJS.ReadableStream,
    rawLogBuffer: Buffer[]
  ): Promise<string> {
    return new Promise((res, rej) => {
      loggerStream.on("end", () => {
        console.log(rawLogBuffer);
        const completeBuffer = Buffer.concat(rawLogBuffer);
        const decodedStream = decodeDockerStream(completeBuffer);
        console.log(decodedStream);
        if (decodedStream.stderr) {
          rej(decodedStream.stderr);
        } else {
          res(decodedStream.stdout);
        }
      });
    });
  }
}

export default CppExecutor;
