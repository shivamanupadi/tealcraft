import { TSClient } from "../TSClient/TSClient";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";
import { Project } from "ts-morph";

export class ScriptRunner {
  initProject(): Project {
    return new Project({
      useInMemoryFileSystem: true,
      compilerOptions: {
        experimentalDecorators: true,
      },
    });
  }

  getProject(clientCode: string): Project {
    const project = this.initProject();

    const srcDir = "src/";
    const clientCodePath = `${srcDir}/client.ts`;
    project.createSourceFile(clientCodePath, clientCode);

    return project;
  }

  run(appSpec: AppSpec) {
    const clientCode = new TSClient().generate(appSpec);

    const project = this.getProject(clientCode);
    const transpiledCode = project
      .emitToMemory()
      .getFiles()
      .find((file) => file.filePath.endsWith(".js"))?.text;

    console.log(transpiledCode);

    // Execute the transpiled JavaScript code (not recommended for untrusted code)
    if (transpiledCode) {
      const result = eval(transpiledCode);
      console.log(result);
    }
  }
}
