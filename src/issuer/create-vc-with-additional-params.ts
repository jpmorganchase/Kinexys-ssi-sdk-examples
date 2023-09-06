import {
  JsonSchema,
  KeyDIDMethod,
  SchemaManager,
  createCredentialFromSchema,
} from "@jpmorganchase/onyx-ssi-sdk";
import { camelCase } from "lodash";
import path from "path";
import {
  HOLDER_EDDSA_PRIVATE_KEY,
  ISSUER_EDDSA_PRIVATE_KEY,
  VC_DIR_PATH,
  VC_SCHEMA_URL,
} from "../../config";
import { privateKeyBufferFromString } from "../utils/convertions";
import { writeToFile } from "../utils/writer";

const createVcWithAdditonalParams = async (VC_SCHEMA_URL: string) => {
  const didKey = new KeyDIDMethod();

  const issuerDidWithKeys = await didKey.generateFromPrivateKey(
    privateKeyBufferFromString(ISSUER_EDDSA_PRIVATE_KEY)
  );

  const holderDidWithKeys = await didKey.generateFromPrivateKey(
    privateKeyBufferFromString(HOLDER_EDDSA_PRIVATE_KEY)
  );

  const vcDidKey = (await didKey.create()).did;

  const credentialType = "PROOF_OF_ADDRESS";

  const subjectData: Object = {
    name: "Jessie Doe",
    address: "1234 Mockingbird Lane",
    city: "Anytown",
    state: "Anystate",
    country: "USA",
    zip: "012345",
  };

  //Setting an expiration data parameter for the VC
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(new Date().getFullYear() + 1);

  const expirationDate = oneYearFromNow.toISOString();

  const additionalParams = {
    id: vcDidKey,
    expirationDate: expirationDate,
  };

  //Schema validation
  const proofOfAddressSchema = await SchemaManager.getSchemaRemote(
    VC_SCHEMA_URL
  );

  const validation: any = await SchemaManager.validateCredentialSubject(
    subjectData,
    proofOfAddressSchema as JsonSchema
  );

  if (validation) {
    console.log(
      `\nGenerating Verifiable Credential of type ${credentialType}\n`
    );

    const vc = await createCredentialFromSchema(
      VC_SCHEMA_URL,
      issuerDidWithKeys.did,
      holderDidWithKeys.did,
      subjectData,
      credentialType,
      additionalParams
    );

    console.log(JSON.stringify(vc, null, 2));

    writeToFile(
      path.resolve(VC_DIR_PATH, `${camelCase(credentialType)}.json`),
      JSON.stringify(vc, null, 2)
    );
  } else {
    console.log(validation.errors);
  }
};

const main = () => {
  VC_SCHEMA_URL
    ? createVcWithAdditonalParams(VC_SCHEMA_URL)
    : console.log(
        "Could not find a remote URL for the VC Schema, please review the VC_SCHEMA_URL field in your .env file"
      );
};
main();
