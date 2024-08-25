import Docker from "dockerode";

async function createContainer(imageName: string, cmdExecutable: string[]) {
  const docker = new Docker();
  console.log("inside create container");

  const container = await docker.createContainer({
    Image: imageName,
    Cmd: cmdExecutable,
    AttachStdin: true, //to enable input streams
    AttachStdout: true, //to enable output streams
    AttachStderr: true, //to enable error streams
    Tty: false,
    OpenStdin: true, //keep the input stream open even no interaction is there
  });

  console.log("after create container");

  return container;
}

export default createContainer;
