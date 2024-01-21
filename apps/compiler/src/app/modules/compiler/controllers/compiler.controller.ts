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

const rimrafAsync = promisify(rimraf);

@Controller("api/compiler")
export class CompilerController {
  containerName = "puya-compiler";

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
  async compile(@Body() body: { source: string; name: string }): Promise<any> {
    try {
      const { source, name } = body;
      const folderName = uuidv4();

      const folderPath = path.resolve(`./app/contracts/${folderName}`);
      const filePath = path.resolve(`${folderPath}/${name}.py`);

      await fs.mkdir(folderPath, { recursive: true });

      await fs.writeFile(filePath, source);

      const dockerFilePath = `contracts/${folderName}`;
      const dockerCommand = `docker exec ${this.containerName} puyapy --no-output-teal ${dockerFilePath}`;

      try {
        await this.execCommand(dockerCommand);
        const appSpecPath = path.resolve(
          `./app/contracts/${folderName}/application.json`,
        );
        const appSpec = await fs.readFile(appSpecPath, "utf-8");
        rimrafAsync(folderPath, {});
        return appSpec;
      } catch (e) {
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async execCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      childProcess.exec(command, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}
