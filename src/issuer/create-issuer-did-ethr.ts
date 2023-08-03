import { DIDWithKeys, EthrDIDMethod } from "@inprd/ssi";
import { ISSUER_ES256K_PRIVATE_KEY, ethrProvider } from "../../config";

const createDidEthrFromPrivateKey = async () => {
  const didEthr = new EthrDIDMethod(ethrProvider);
  const issuerDidKey: DIDWithKeys = await didEthr.generateFromPrivateKey(
    ISSUER_ES256K_PRIVATE_KEY!
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

const createDidEthr = async () => {
  const didEthr = new EthrDIDMethod(ethrProvider);
  const issuerEthrDid: DIDWithKeys = await didEthr.create();

  console.log("Creating a key pair");
  console.log("==========================");
  console.log("key pair generated");
  console.log(`Algorithm: ${issuerEthrDid.keyPair.algorithm}`);
  console.log(
    `Private Key: ${Buffer.from(issuerEthrDid.keyPair.privateKey).toString(
      "hex"
    )}`
  );
  console.log(
    `Public Key: ${Buffer.from(issuerEthrDid.keyPair.publicKey).toString(
      "hex"
    )}`
  );
  console.log("==========================");
  console.log(`Generating did:key`);
  console.log(`Issuer did: ${issuerEthrDid.did}`);
};

const main = () => {
  ISSUER_ES256K_PRIVATE_KEY ? createDidEthrFromPrivateKey() : createDidEthr();
};

main();
