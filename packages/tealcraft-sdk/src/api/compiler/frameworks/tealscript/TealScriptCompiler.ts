import { Project } from "ts-morph";
import { VERSION } from "@algorandfoundation/tealscript/dist/version";
import axios from "axios";
import { A_CompileResult, A_Contract } from "../../../../types";
import { Compiler } from "@algorandfoundation/tealscript";

export class TealScriptCompiler {
  async getCompilerVersion(): Promise<string> {
    return VERSION;
  }

  initProject(): Project {
    return new Project({
      useInMemoryFileSystem: true,
      compilerOptions: {
        experimentalDecorators: true,
      },
    });
  }

  async getProject() {
    const project = this.initProject();

    const libDir = "src/lib";

    const indexPath = `${libDir}/index.ts`;
    const compilerPath = `${libDir}/compiler.ts`;
    const contractPath = `${libDir}/contract.ts`;
    const optimizePath = `${libDir}/optimize.ts`;
    const lsigPath = `${libDir}/lsig.ts`;

    const typesPath = "types/global.d.ts";

    const tealScriptVersion: string = await this.getCompilerVersion();
    const promises = [
      indexPath,
      typesPath,
      contractPath,
      lsigPath,
      compilerPath,
      optimizePath,
    ].map(async (p) => {
      const url = `https://raw.githubusercontent.com/algorandfoundation/TEALScript/${tealScriptVersion}/${p}`;
      const response = await axios.get(url);
      const text = response.data;
      project.createSourceFile(p, text);
    });

    await Promise.all(promises);

    return project;
  }

  async compile(contract: A_Contract): Promise<A_CompileResult> {
    const project = await this.getProject();

    let { name, source } = contract;

    source = `import { Contract, LogicSig } from '../../src/lib/index';
    ${source}
    `;

    const srcPath = `contracts/${name}/${name}.ts`;
    project.createSourceFile(srcPath, source);

    const compiler = new Compiler({
      srcPath,
      className: name,
      project,
      cwd: "/",
    });

    await compiler.compile();

    return {
      appSpec: compiler.appSpec(),
    };
  }

  getDefaultTemplate(name: string): string {
    return `//No imports needed: Contract, LogicSig and all TealScript types are globally available
    
export class ${name} extends Contract {
    /** Target AVM 9 */
    programVersion = 9;

    /**
     * createApplication
    */
    createApplication(): boolean {
        return true;
    }
}`;
  }
}
