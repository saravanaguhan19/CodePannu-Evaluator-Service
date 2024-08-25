import DockerStreamOutput from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";

export default function decodeDockerStream(buffer: Buffer): DockerStreamOutput {
  let offset = 0; // this variable keeps track of the current position in the buffer while parsing

  const output: DockerStreamOutput = { stdout: "", stderr: "" };

  //loop untill offset reaches the end of the buffer
  while (offset < buffer.length) {
    //typeOfStream is read from buffer and has value as type of stream
    const typeOfStream = buffer[offset];

    //this length variable holds the length of the value
    //we will read this variable on an offset og 4 byte from the start of the chunk

    const length = buffer.readUint32BE(offset + 4);

    //as now we have read the header , we can move forward to the value of the chunk

    offset += DOCKER_STREAM_HEADER_SIZE;

    if (typeOfStream === 1) {
      //stdout stream
      output.stdout += buffer.toString("utf-8", offset, offset + length);
    } else if (typeOfStream === 2) {
      //stderr stream
      output.stderr += buffer.toString("utf-8", offset, offset + length);
    }

    offset += length; // moves offset to next chunk
  }

  return output;
}
