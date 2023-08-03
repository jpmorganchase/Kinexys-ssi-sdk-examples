import { generateES256KKeyPair, generateEdDSAKeyPair } from "../utils/keygen";
import { readFromUserInput } from "../utils/reader";

const generateKeyPair = (keyType: string) => {
  switch (keyType) {
    case "1":
      return generateEdDSAKeyPair();
    case "2":
      return generateES256KKeyPair();
    default:
      throw new Error("Invalid key type");
  }
};

const main = () => {
  readFromUserInput.question(
    `What type of keypair would you like to generate?
    1. EdDSA
    2. ES256K
    `,
    async (keypair) => {
      const { privateKey, publicKey } = await generateKeyPair(keypair);
      console.log(`Private key: ${privateKey}`);
      console.log(`Public key: ${publicKey}`);
      readFromUserInput.close();
    }
  );
};

main();
