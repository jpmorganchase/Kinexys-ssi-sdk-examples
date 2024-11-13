import { DIDWithKeys, KeyDIDMethod } from "@jpmorganchase/Kinexys-ssi-sdk";
import { ISSUER_EDDSA_PRIVATE_KEY } from "../../config";
import { privateKeyBufferFromString } from "../utils/convertions";

const createDidKeyFromPrivateKey = async () => {
  const didKey = new KeyDIDMethod();
  const issuerDidKey: DIDWithKeys = await didKey.generateFromPrivateKey(
    privateKeyBufferFromString(ISSUER_EDDSA_PRIVATE_KEY!)
  );

  console.log("Restoring from a private key pair");
  console.log("==========================");
  console.log("key pair generated");
  console.log(`Algorithm: ${issuerDidKey.keyPair.algorithm}`);
  console.log(
    `Public Key: ${Buffer.from(issuerDidKey.keyPair.publicKey).toString("hex")}`
  );
  console.log("==========================");
  console.log(`Generating did:key`);
  console.log(`Issuer did: ${issuerDidKey.did}`);
};

const createDidKey = async () => {
  const didKey = new KeyDIDMethod();
  const issuerDidKey: DIDWithKeys = await didKey.create();

  console.log("Creating a key pair");
  console.log("==========================");
  console.log("key pair generated");
  console.log(`Algorithm: ${issuerDidKey.keyPair.algorithm}`);
  console.log(
    `Private Key: ${Buffer.from(issuerDidKey.keyPair.privateKey).toString(
      "hex"
    )}`
  );
  console.log(
    `Public Key: ${Buffer.from(issuerDidKey.keyPair.publicKey).toString("hex")}`
  );
  console.log("==========================");
  console.log(`Generating did:key`);
  console.log(`Issuer did: ${issuerDidKey.did}`);
};

const main = () => {
  ISSUER_EDDSA_PRIVATE_KEY ? createDidKeyFromPrivateKey() : createDidKey();
};

main();
