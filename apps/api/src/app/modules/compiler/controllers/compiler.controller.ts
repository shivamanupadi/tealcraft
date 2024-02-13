import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import * as fs from "fs/promises";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import childProcess from "child_process";
import { rimraf } from "rimraf";
import { promisify } from "util";
import { ContractService } from "../../database/services/contract.service";

const rimrafAsync = promisify(rimraf);
const CONTRACTS_PATH = "./mount/python/puya/contracts/";

@Controller("compiler")
export class CompilerController {
  constructor(private contractService: ContractService) {}
  private containerName = "api-container";

  @Get("version")
  async version(): Promise<string> {
    const dockerCommand = `docker exec ${this.containerName} pip show puya | grep Version | awk '{print $2}'`;
    try {
      return await this.execCommand(dockerCommand);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("compile")
  async compile(@Body() body: any): Promise<any> {
    try {
      const { source, name } = body;
      const folderName = uuidv4();
      const { folderPath } = await this.setupCompilation(
        folderName,
        name,
        source,
      );
      const dockerFilePath = `python/puya/contracts/${folderName}`;
      const dockerCommand = `docker exec ${this.containerName} puyapy --no-output-teal ${dockerFilePath}`;

      try {
        await this.execCommand(dockerCommand);
        const appSpecPath = path.resolve(
          `${CONTRACTS_PATH}${folderName}/application.json`,
        );
        const appSpec = await fs.readFile(appSpecPath, "utf-8");
        rimrafAsync(folderPath, {});
        return appSpec;
      } catch (e) {
        rimrafAsync(folderPath, {});
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async setupCompilation(
    folderName: string,
    name: string,
    source: string,
  ): Promise<{ folderPath: string }> {
    const folderPath = path.resolve(`${CONTRACTS_PATH}${folderName}`);
    const filePath = path.resolve(`${folderPath}/${name}.py`);
    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(filePath, source);
    return { folderPath };
  }

  async execCommand(command: string): Promise<string> {
    const execFunction = promisify(childProcess.exec);
    try {
      const { stdout } = await execFunction(command);
      return stdout;
    } catch (error) {
      throw error;
    }
  }
}
