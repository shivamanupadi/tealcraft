import axios from "axios";

export class Tealer {
  private readonly tealerUrl: string;

  constructor(tealerUrl: string) {
    this.tealerUrl = tealerUrl;
  }

  async audit(name: string, source: string): Promise<any> {
    const url = `${this.tealerUrl}/audit`;
    const response = await axios.post(url, { name, source });
    return response.data;
  }
}
