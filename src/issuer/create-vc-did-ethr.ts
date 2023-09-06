import { EthrDIDMethod, createCredential } from "@jpmorganchase/onyx-ssi-sdk";
import { camelCase } from "lodash";
import path from "path";
import {
  HOLDER_ES256K_PRIVATE_KEY,
  ISSUER_ES256K_PRIVATE_KEY,
  VC_DIR_PATH,
  ethrProvider,
} from "../../config";
import { writeToFile } from "../utils/writer";

const createVc = async () => {
  const didEthr = new EthrDIDMethod(ethrProvider);

  const issuerDidWithKeys = await didEthr.generateFromPrivateKey(
    ISSUER_ES256K_PRIVATE_KEY
  );

  const holderDidWithKeys = await didEthr.generateFromPrivateKey(
    HOLDER_ES256K_PRIVATE_KEY
  );

  const vcDidwithKey = await didEthr.create();
  console.log("\n!!!!!! IMPORTANT: SAVE THIS PRIVATE KEY !!!!!!!\n");
  console.log(
    `\nVC_ES256K_PRIVATE_KEY: ${Buffer.from(
      vcDidwithKey.keyPair.privateKey
    ).toString("hex")}\n`
  );

  console.log("\nVC did private key\n");
  console.log(vcDidwithKey.keyPair.privateKey);

  const vcDidKey = vcDidwithKey.did;

  const credentialType = "PROOF_OF_NAME";

  const subjectData = {
    name: "Jessie Doe",
  };

  //vc id, expirationDate, credentialStatus, credentialSchema, etc
  const additionalParams = {
    id: vcDidKey,
  };

  console.log(`\nGenerating Verifiable Credential of type ${credentialType}\n`);

  const vc = createCredential(
    issuerDidWithKeys.did,
    holderDidWithKeys.did,
    subjectData,
    [credentialType],
    additionalParams
  );

  console.log(JSON.stringify(vc, null, 2));

  writeToFile(
    path.resolve(VC_DIR_PATH, `${camelCase(credentialType)}.json`),
    JSON.stringify(vc, null, 2)
  );
};

createVc();
