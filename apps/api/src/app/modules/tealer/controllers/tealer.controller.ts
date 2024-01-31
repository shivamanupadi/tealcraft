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
const TEALER_PATH = "./app/tealer/";
const TEALER_EXPORT_PATH = "./app/tealer-export/tealer/";

@Controller("tealer")
export class TealerController {
  constructor(private contractService: ContractService) {}
  private containerName = "puya-compiler";

  @Get("version")
  async version(): Promise<string> {
    const dockerCommand = `docker exec ${this.containerName} pip show tealer | grep Version | awk '{print $2}'`;
    try {
      return await this.execCommand(dockerCommand);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("audit")
  async audit(@Body() body: any): Promise<any> {
    try {
      const { source, name } = body;
      const folderName = uuidv4();
      const { folderPath } = await this.setupAudit(folderName, name, source);
      const dockerFilePath = `tealer/${folderName}/${name}.teal`;
      const dockerCommand = `docker exec ${this.containerName} tealer detect --contracts ${dockerFilePath}`;

      const outputPath = path.resolve(`${TEALER_EXPORT_PATH}${folderName}`);
      try {
        const stdout: string = await this.execCommand(dockerCommand);
        rimrafAsync(folderPath, {});
        rimrafAsync(outputPath, {});
        return stdout;
      } catch (e) {
        rimrafAsync(folderPath, {});
        rimrafAsync(outputPath, {});
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async setupAudit(
    folderName: string,
    name: string,
    source: string,
  ): Promise<{ folderPath: string; filePath: string }> {
    const folderPath = path.resolve(`${TEALER_PATH}${folderName}`);
    const filePath = path.resolve(`${folderPath}/${name}.teal`);
    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(filePath, source);
    return { folderPath, filePath };
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
