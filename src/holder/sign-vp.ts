import {
  DIDWithKeys,
  EthrDIDMethod,
  JWTService,
  KeyDIDMethod,
} from "@jpmorganchase/onyx-ssi-sdk";
import { camelCase, includes } from "lodash";
import path from "path";
import {
  HOLDER_EDDSA_PRIVATE_KEY,
  HOLDER_ES256K_PRIVATE_KEY,
  VP,
  VP_DIR_PATH,
  ethrProvider,
} from "../../config";
import { privateKeyBufferFromString } from "../utils/convertions";
import { writeToFile } from "../utils/writer";

const jwtService = new JWTService();
const didKey = new KeyDIDMethod();

const signVP = (holderDidWithKeys: DIDWithKeys, token: any) => {
  return jwtService.signVP(holderDidWithKeys, token);
};

const signVp = async () => {
  if (VP) {
    console.log("\nReading an existing verifiable presentation\n");

    const vp = require(path.resolve(VP_DIR_PATH, VP));
    console.log(vp);

    if (includes(vp.holder, "ethr")) {
      console.log("VP did method: did:ethr");

      const didEthr = new EthrDIDMethod(ethrProvider);
      const didWithKeys = await didEthr.generateFromPrivateKey(
        HOLDER_ES256K_PRIVATE_KEY
      );

      if (didWithKeys.did === vp.holder) {
        console.log("\nSinging the VP\n");

        const signedVp = await signVP(didWithKeys, vp);
        console.log(signedVp);

        writeToFile(
          path.resolve(VP_DIR_PATH, `${camelCase(VP)}.jwt`),
          signedVp
        );
      } else {
        console.log(
          "HOLDER_ES256K_PRIVATE_KEY cannot sign this verifiable presentation\n"
        );
      }
    } else if (includes(vp.holder, "key")) {
      console.log("\nVP did method: did:key\n");

      const didWithKeys = await didKey.generateFromPrivateKey(
        privateKeyBufferFromString(HOLDER_EDDSA_PRIVATE_KEY)
      );

      if (didWithKeys.did === vp.holder) {
        console.log("\nSinging the VP\n");

        const signedVp = await signVP(didWithKeys, vp);
        console.log(signedVp);

        writeToFile(
          path.resolve(VP_DIR_PATH, `${camelCase(VP)}.jwt`),
          signedVp
        );
      } else {
        console.log(
          "\nHOLDER_EDDSA_PRIVATE_KEY cannot sign this verifiable presentation\n"
        );
      }
    }
  } else {
    console.log("\nVP not found!\n");
    console.log("\nTo run this script you must have a valid VP\n");
    console.log("\nPlease refer to holder scripts and generate a VP\n");
  }
};

signVp();
