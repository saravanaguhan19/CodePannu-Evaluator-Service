import JavaExecutor from "../containers/javaExecutor";
import PythonExecutor from "../containers/pythonExecutor";
import CppExecutor from "../containers/runCppDocker";
import { CodeExecutorStrategy } from "../types/CodeExecutorStrategy";

export default function createExecutor(
  codeLanguage: string
): CodeExecutorStrategy | null {
  if (codeLanguage === "PYTHON") {
    return new PythonExecutor();
  } else if (codeLanguage === "CPP") {
    return new CppExecutor();
  } else if (codeLanguage === "JAVA") {
    return new JavaExecutor();
  } else {
    return null;
  }
}
