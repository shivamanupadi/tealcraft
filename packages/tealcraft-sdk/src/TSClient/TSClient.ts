import {
  generate,
  writeDocumentPartsToString,
} from "@algorandfoundation/algokit-client-generator";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";

export class TSClient {
  generate(appSpec: AppSpec): string {
    const client = generate(appSpec);
    return writeDocumentPartsToString(client);
  }
}
