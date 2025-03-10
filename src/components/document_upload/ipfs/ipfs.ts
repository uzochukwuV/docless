import { PinataSDK } from "pinata-web3"

export class IPFSService {
  private client: any;

  async initialize() {
    this.client = new PinataSDK({
        pinataJwt: `${import.meta.env.VITE_PINATA_JWT}`,
        pinataGateway: `${import.meta.env.VITE_GATEWAY_URL}`
      });
    // Note: You'll need to add proper authentication here
  }

  async uploadFile(file: File): Promise<string> {
    if (!this.client) await this.initialize();
    
    const {IpfsHash} = await this.client.upload.file(file);
    return IpfsHash.toString();
  }
}

export const ipfsService = new IPFSService();