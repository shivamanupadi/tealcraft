import { A_Framework } from "../../../types";
//@ts-ignore
import puyaLogo from "!!raw-loader!./logos/puya.txt";
//@ts-ignore
import tealscriptLogo from "!!raw-loader!./logos/tealscript.txt";

export class CoreFramework {
  private framework: A_Framework;

  constructor(framework: A_Framework) {
    this.framework = framework;
  }

  getExtension(): string {
    return this.framework.extension;
  }

  getLogo(): string {
    const { id } = this.framework;
    if (id === "tealscript") {
      return `data:image/png;base64, ${tealscriptLogo}`;
    }
    if (id === "puya") {
      return `data:image/png;base64, ${puyaLogo}`;
    }
    return "";
  }
}
