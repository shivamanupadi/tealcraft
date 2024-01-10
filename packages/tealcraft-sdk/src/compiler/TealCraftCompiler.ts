import { Project } from "ts-morph";
import { VERSION } from "@algorandfoundation/tealscript/dist/version";
import axios from "axios";
import { A_Contract } from "../types";
import { Compiler } from "@algorandfoundation/tealscript";

export class TealCraftCompiler {
  getTealScriptVersion(): string {
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
    const lsigPath = `${libDir}/lsig.ts`;

    const typesPath = "types/global.d.ts";

    const tealScriptVersion: string = this.getTealScriptVersion();
    const promises = [
      indexPath,
      typesPath,
      contractPath,
      lsigPath,
      compilerPath,
    ].map(async (p) => {
      const url = `https://raw.githubusercontent.com/algorandfoundation/TEALScript/${tealScriptVersion}/${p}`;
      const response = await axios.get(url);
      const text = response.data;
      project.createSourceFile(p, text);
    });

    await Promise.all(promises);

    return project;
  }

  async compile(contract: A_Contract): Promise<Compiler> {
    const project = await this.getProject();

    let { name, source } = contract;

    source = `import {Contract } from '../../src/lib/index';
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

    return compiler;
  }
}
