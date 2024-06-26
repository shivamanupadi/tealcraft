import axios from "axios";
import { A_CompileResult, A_Contract } from "../../../../types";

export class PuyaCompiler {
  private readonly compilerUrl: string;

  constructor(compilerUrl: string) {
    this.compilerUrl = compilerUrl;
  }

  async getCompilerVersion(): Promise<string> {
    const url = `${this.compilerUrl}/version`;
    const response = await axios.get(url);
    return response.data;
  }

  async compile(contract: A_Contract): Promise<A_CompileResult> {
    let { name, source } = contract;

    const url = `${this.compilerUrl}/compile`;
    const response = await axios.post(url, { name, source });
    const appSpec = response.data;

    return {
      appSpec: appSpec,
    };
  }

  getDefaultTemplate(name: string): string {
    return `from puyapy import ARC4Contract
from puyapy.arc4 import String, abimethod


class ${name}(ARC4Contract):
    @abimethod
    def say_hello(self, name: String) -> String:
        return "Hello " + name`;
  }
}
