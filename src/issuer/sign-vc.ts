import {
  DIDWithKeys,
  EthrDIDMethod,
  JWTService,
  KeyDIDMethod,
  createCredential,
} from "@jpmorganchase/onyx-ssi-sdk";
import { camelCase, includes } from "lodash";
import path from "path";
import {
  HOLDER_EDDSA_PRIVATE_KEY,
  ISSUER_EDDSA_PRIVATE_KEY,
  ISSUER_ES256K_PRIVATE_KEY,
  VC,
  VC_DIR_PATH,
  ethrProvider,
} from "../../config";
import { privateKeyBufferFromString } from "../utils/convertions";
import { writeToFile } from "../utils/writer";

const didKey = new KeyDIDMethod();
const jwtService = new JWTService();

const issuerDidWithKeys = async () =>
  await didKey.generateFromPrivateKey(
    privateKeyBufferFromString(ISSUER_EDDSA_PRIVATE_KEY)
  );

const createVc = async () => {
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

  console.log(`\nGenerating ${credentialType} Verifiable Credentials\n`);

  return createCredential(
    (await issuerDidWithKeys()).did,
    holderDidWithKeys.did,
    subjectData,
    [credentialType],
    additionalParams
  );
};

const signVc = async (issuerDidWithKeys: DIDWithKeys, vc: any) => {
  return jwtService.signVC(issuerDidWithKeys, vc);
};

const main = async () => {
  if (VC_DIR_PATH && VC) {
    console.log("\nReading an existing verifiable credential\n");

    const vc = require(path.resolve(VC_DIR_PATH, VC));
    console.log(JSON.stringify(vc, null, 2));

    //verify vc did

    if (includes(vc.id, "ethr")) {
      console.log("VC did method: did:ethr");

      const didEthr = new EthrDIDMethod(ethrProvider);
      const didWithKeys = await didEthr.generateFromPrivateKey(
        ISSUER_ES256K_PRIVATE_KEY
      );

      if (didWithKeys.did === vc.issuer.id) {
        console.log("\nSinging the VC\n");
        const jwt = await signVc(didWithKeys, vc);
        console.log(jwt);

        writeToFile(
          path.resolve(VC_DIR_PATH, `${camelCase(vc.type[1])}.jwt`),
          jwt
        );
      } else {
        console.log(
          "ISSUER_ES256K_PRIVATE_KEY cannot sign this verifiable credentail\n"
        );
      }
    } else if (includes(vc.id, "key")) {
      console.log("\nVC did method: did:key\n");

      const didWithKeys = await didKey.generateFromPrivateKey(
        privateKeyBufferFromString(ISSUER_EDDSA_PRIVATE_KEY)
      );

      if (didWithKeys.did === vc.issuer.id) {
        console.log("\nSinging the VC\n");
        const jwt = await signVc(didWithKeys, vc);
        console.log(jwt);

        writeToFile(
          path.resolve(VC_DIR_PATH, `${camelCase(vc.type[1])}.jwt`),
          jwt
        );
      } else {
        console.log(
          "\nISSUER_EDDSA_PRIVATE_KEY cannot sign this verifiable credentail\n"
        );
      }
    }
  } else {
    const vc = await createVc();
    console.log(JSON.stringify(vc, null, 2));
    console.log("\nSaving VC JSON\n");

    writeToFile(
      path.resolve(VC_DIR_PATH, `${camelCase(vc.type[1])}.json`),
      JSON.stringify(vc, null, 2)
    );

    console.log("\nSinging the VC\n");
    const jwt = await signVc(await issuerDidWithKeys(), vc);
    console.log(jwt);

    console.log("\nSaving signed VC JWT\n");
    writeToFile(path.resolve(VC_DIR_PATH, `${camelCase(vc.type[1])}.jwt`), jwt);
  }
};

main();
