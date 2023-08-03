export const privateKeyBufferFromString = (
    privateKeyString: string
  ): Uint8Array => {
    const buffer: Buffer = Buffer.from(privateKeyString, "hex");
    return new Uint8Array(buffer);
  };