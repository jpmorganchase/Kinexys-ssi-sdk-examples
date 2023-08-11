import { EthrDIDMethod, createCredential } from "@jpmorganchase/onyx-ssi-sdk";
import {
  HOLDER_ES256K_PRIVATE_KEY,
  ISSUER_ES256K_PRIVATE_KEY,
  VC_ES256K_PRIVATE_KEY,
  ethrProvider,
} from "../../config";

const didEthr = new EthrDIDMethod(ethrProvider);

const createVc = async () => {
  const issuerDidWithKeys = await didEthr.generateFromPrivateKey(
    ISSUER_ES256K_PRIVATE_KEY
  );

  const holderDidWithKeys = await didEthr.generateFromPrivateKey(
    HOLDER_ES256K_PRIVATE_KEY
  );

  const vcDidwithKey = await didEthr.create();

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

  return vcDidwithKey;
};

const main = async () => {
  if (VC_ES256K_PRIVATE_KEY) {
    const didWithKeys = await didEthr.generateFromPrivateKey(
      VC_ES256K_PRIVATE_KEY
    );
    console.log(`\nDeactivating ${didWithKeys.did}\n`);
    await didEthr.deactivate(didWithKeys);
    console.log("Deactivation Successful");
  } else {
    console.log("\nVC_ES256K_PRIVATE_KEY not found\n");
    console.log("\nVC_ES256K_PRIVATE_KEY not found\n");
    const vcDidwithKey = await createVc();
    console.log(`\nDeactivating ${vcDidwithKey.did}\n`);
    await didEthr.deactivate(vcDidwithKey);
    console.log("Deactivation Successful");
  }
};

main();
