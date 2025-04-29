import { createHash, createCipheriv, createDecipheriv } from "crypto";

interface InitOptions {
  working_key?: string;
  merchant_id?: string;
}

interface OrderParams {
  [key: string]: string;
}

class Configure {
  private initOptions: InitOptions;

  constructor(options: InitOptions) {
    this.initOptions = options || {};
  }

  private validate(key: keyof InitOptions): boolean {
    return this.initOptions && this.initOptions[key] ? true : false;
  }

  private throwError(requirement: string): never {
    throw new Error(`${requirement} is required to perform this action`);
  }

  encrypt(plainText: string): string {
    if (this.validate("working_key") && plainText) {
      const { working_key } = this.initOptions;
      const m = createHash("md5");
      m.update(working_key as string);
      const key = m.digest();
      const iv = Buffer.from([
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
        0x0c, 0x0d, 0x0e, 0x0f,
      ]);
      const cipher = createCipheriv("aes-128-cbc", key, iv);
      let encoded = cipher.update(plainText, "utf8", "hex");
      encoded += cipher.final("hex");
      return encoded;
    } else if (!plainText) {
      this.throwError("Plain text");
    } else {
      this.throwError("Working Key");
    }
    return ""; // Unreachable, but TypeScript requires it
  }

  decrypt(encText: string): string {
    if (this.validate("working_key") && encText) {
      const { working_key } = this.initOptions;
      const m = createHash("md5");
      m.update(working_key as string);
      const key = m.digest();
      const iv = Buffer.from([
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
        0x0c, 0x0d, 0x0e, 0x0f,
      ]);
      const decipher = createDecipheriv("aes-128-cbc", key, iv);
      let decoded = decipher.update(encText, "hex", "utf8");
      decoded += decipher.final("utf8");
      return decoded;
    } else if (!encText) {
      this.throwError("Encrypted text");
    } else {
      this.throwError("Working Key");
    }
    return ""; // Unreachable, but TypeScript requires it
  }

  redirectResponseToJson(response: string): Record<string, string> {
    if (response) {
      const ccavResponse = this.decrypt(response);
      const responseArray = ccavResponse.split("&");
      return responseArray.reduce((acc, pair) => {
        const [key, value] = pair.split("=");
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
    } else {
      this.throwError("CCAvenue encrypted response");
    }
  }

  getEncryptedOrder(orderParams: OrderParams): string {
    if (this.validate("merchant_id") && orderParams) {
      let data = `merchant_id=${this.initOptions.merchant_id}`;
      data += Object.entries(orderParams)
        .map(([key, value]) => `&${key}=${value}`)
        .join("");
      return this.encrypt(data);
    } else if (!orderParams) {
      this.throwError("Order Params");
    } else {
      this.throwError("Merchant ID");
    }
    return ""; // Unreachable, but TypeScript requires it
  }
}

const CCAvenue = new Configure({
  working_key: process.env.NEXT_PUBLIC_CCAVENUE_WORKING_KEY, // Working Key from CCAvenue
  merchant_id: process.env.NEXT_PUBLIC_CCAVENUE_MERCHANT_ID, // Merchant ID from CCAvenue
});

export default CCAvenue;
