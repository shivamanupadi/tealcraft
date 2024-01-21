import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { ContractEntity } from "../Entities/contract.entity";

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    private contractsRepository: Repository<ContractEntity>,
  ) {}

  /**
   * Saves a workspace entity.
   *
   * @param {string} name - The name of the workspace.
   * @param source
   * @param frameworkId
   * @return {Promise<ContractEntity>} - A promise that resolves to the saved workspace entity.
   */
  async save(
    name: string,
    source: string,
    frameworkId: string,
  ): Promise<ContractEntity> {
    const workspaceData = { name, source, frameworkId };
    return await this.contractsRepository.save(workspaceData);
  }

  /**
   * Deletes a workspace based on the provided ID.
   *
   * @param {string} id - The ID of the workspace to be deleted.
   * @return {Promise<DeleteResult>} - A Promise that resolves to a DeleteResult object.
   */
  async delete(id: number): Promise<DeleteResult> {
    return await this.contractsRepository.delete({ id });
  }

  /**
   * Finds the workspace entities for a given user ID.
   *
   * @returns {Promise<ContractEntity[]>} - A promise that resolves to an array of workspace entities.
   * @param id
   */
  async find(id: number): Promise<ContractEntity | null> {
    return await this.contractsRepository.findOneBy({ id });
  }
}
