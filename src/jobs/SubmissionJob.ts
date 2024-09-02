import { Job } from "bullmq";

import { IJob } from "../types/bullMqJobDefinition";
import { ExecutionResponse } from "../types/CodeExecutorStrategy";
import { SubmissionPayload } from "../types/submissionPayload";
import createExecutor from "../utils/ExecutionFactory";

export default class SubmissionJob implements IJob {
  name: string;
  payload: Record<string, SubmissionPayload>;

  constructor(payload: Record<string, SubmissionPayload>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }

  handle = async (job?: Job) => {
    console.log("Handler of the job called");
    console.log(this.payload);
    console.log("----------------");
    console.log(this.payload.language);

    console.log("----------------");

    if (job) {
      // console.log(job.name, job.id, job.data);
      const key = Object.keys(this.payload)[0];
      const codeLanguage = this.payload[key].language;
      const code = this.payload[key].code;
      const inputTestCase = this.payload[key].inputCase;
      const outputTestCase = this.payload[key].outputCase;
      // const key = Object.keys(this.payload)[0];
      // const codeLanguage = this.payload.language;
      // const code = this.payload.code;
      // const inputTestCase = this.payload.inputCase;
      // const outputTestCase = this.payload.outputCase;
      // console.log(this.payload[key].language);

      // if (codeLanguage === "CPP") {
      //   const response = await runCpp(
      //     this.payload[key].code,
      //     this.payload[key].inputCase
      //   );
      //   console.log("Evaluated response is ", response);
      // }

      const strategy = createExecutor(codeLanguage);
      console.log("strategy: ", strategy);

      if (strategy != null) {
        const response: ExecutionResponse = await strategy.execute(
          code,
          inputTestCase,
          outputTestCase
        );

        if (response.status === "COMPLETED") {
          console.log("Code execution successfully");
          console.log(response);
        } else {
          console.log("Something went wrong with code execution");
          console.log(response);
        }
      }
    }
  };

  failed = (job?: Job): void => {
    console.log("Job failed");
    if (job) {
      console.log(job.id);
    }
  };
}
