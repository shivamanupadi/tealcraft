import { VERSION } from "@algorandfoundation/tealscript/dist/version";
import { A_CompileResult, A_Contract } from "../../../../types";
import { Compiler, Project } from "@algorandfoundation/tealscript";
// @ts-ignore
import indexContent from "!!raw-loader!@algorandfoundation/tealscript/dist/lib/index.ts";
// @ts-ignore
import compilerContent from "!!raw-loader!@algorandfoundation/tealscript/dist/lib/compiler.ts";
// @ts-ignore
import contractContent from "!!raw-loader!@algorandfoundation/tealscript/dist/lib/contract.ts";
// @ts-ignore
import optimizeContent from "!!raw-loader!@algorandfoundation/tealscript/dist/lib/optimize.ts";
// @ts-ignore
import lsigContent from "!!raw-loader!@algorandfoundation/tealscript/dist/lib/lsig.ts";
// @ts-ignore
import typesContent from "!!raw-loader!@algorandfoundation/tealscript/types/global.d.ts";

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

    project.createSourceFile(indexPath, indexContent);
    project.createSourceFile(compilerPath, compilerContent);
    project.createSourceFile(contractPath, contractContent);
    project.createSourceFile(optimizePath, optimizeContent);
    project.createSourceFile(lsigPath, lsigContent);
    project.createSourceFile(typesPath, typesContent);

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
