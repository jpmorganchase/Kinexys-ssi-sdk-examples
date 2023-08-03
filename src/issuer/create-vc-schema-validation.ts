import { KeyDIDMethod, SchemaManager, createCredential } from "@inprd/ssi";
import { camelCase } from "lodash";
import path from "path";
import {
  HOLDER_EDDSA_PRIVATE_KEY,
  ISSUER_EDDSA_PRIVATE_KEY,
  VC_DIR_PATH,
} from "../../config";
import { privateKeyBufferFromString } from "../utils/convertions";
import { writeToFile } from "../utils/writer";

const createVcWithLocalSchema = async () => {
  const didKey = new KeyDIDMethod();

  const issuerDidWithKeys = await didKey.generateFromPrivateKey(
    privateKeyBufferFromString(ISSUER_EDDSA_PRIVATE_KEY)
  );

  const holderDidWithKeys = await didKey.generateFromPrivateKey(
    privateKeyBufferFromString(HOLDER_EDDSA_PRIVATE_KEY)
  );

  const vcDidKey = (await didKey.create()).did;

  const credentialType = "PROOF_OF_NAME";

  const subjectData = {
    name: "Jessie Doe",
  };

  //vc id, expirationDate, credentialStatus, credentialSchema, etc
  const additionalParams = {
    id: vcDidKey,
  };

  //Schema validation
  const proofOfNameSchema = await SchemaManager.getSchemaFromFile(
    path.resolve(`${__dirname}/schemas/${camelCase(credentialType)}.json`)
  );

  const validation: any = await SchemaManager.validateCredentialSubject(
    subjectData,
    proofOfNameSchema
  );

  if (validation) {
    console.log(
      `\nGenerating Verifiable Cridential of type ${credentialType}\n`
    );

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
  } else {
    console.log("Schema Validation failed");
  }
};

createVcWithLocalSchema();
