import {
  EthrDIDMethod,
  JWTService,
  KeyDIDMethod,
  createAndSignPresentationJWT,
} from "@jpmorganchase/onyx-ssi-sdk";
import fs from "fs";
import { camelCase, includes } from "lodash";
import path from "path";
import {
  HOLDER_EDDSA_PRIVATE_KEY,
  HOLDER_ES256K_PRIVATE_KEY,
  JwtPayload,
  VC,
  VC_DIR_PATH,
  VP_DIR_PATH,
  ethrProvider,
} from "../../config";
import { privateKeyBufferFromString } from "../utils/convertions";
import { writeToFile } from "../utils/writer";

const createAndSignVp = async () => {
  const jwtService = new JWTService();
  const didKey = new KeyDIDMethod();

  if (VC) {
    try {
      console.log("\nReading a existing signed VC JWT\n");
      const signedVcJwt = fs.readFileSync(
        path.resolve(VC_DIR_PATH, `${camelCase(VC)}.jwt`),
        "utf8"
      );
      console.log(signedVcJwt);

      console.log("\nDecoding JWT to get VC\n");
      const signedVc = jwtService.decodeJWT(signedVcJwt)?.payload as JwtPayload;
      console.log(JSON.stringify(signedVc, null, 2));

      if (includes(signedVc.sub, "ethr")) {
        console.log("VP did method: did:ethr");

        const didEthr = new EthrDIDMethod(ethrProvider);
        const didWithKeys = await didEthr.generateFromPrivateKey(
          HOLDER_ES256K_PRIVATE_KEY
        );

        if (didWithKeys.did === signedVc.sub) {
          console.log("\nCreating and signing the VP from VC\n");
          const signedVp = await createAndSignPresentationJWT(didWithKeys, [
            signedVcJwt,
          ]);
          console.log(signedVp);

          writeToFile(
            path.resolve(VP_DIR_PATH, `${camelCase(signedVc.vc.type[1])}.jwt`),
            JSON.stringify(signedVp)
          );
        } else {
          console.log(
            "HOLDER_ES256K_PRIVATE_KEY cannot sign this verifiable credential\n"
          );
        }
      } else if (includes(signedVc.sub, "key")) {
        console.log("\nVP did method: did:key\n");

        const didWithKeys = await didKey.generateFromPrivateKey(
          privateKeyBufferFromString(HOLDER_EDDSA_PRIVATE_KEY)
        );

        if (didWithKeys.did === signedVc.sub) {
          console.log("\nCreating and signing the VP from VC\n");
          const signedVp = await createAndSignPresentationJWT(didWithKeys, [
            signedVcJwt,
          ]);
          console.log(signedVp);

          writeToFile(
            path.resolve(VP_DIR_PATH, `${camelCase(signedVc.vc.type[1])}.jwt`),
            signedVp
          );
        } else {
          console.log(
            "\nHOLDER_EDDSA_PRIVATE_KEY cannot sign this verifiable credentail\n"
          );
        }
      }
    } catch (err) {
      console.log("\nFailed to fetch file\n");
      console.log(
        "\nTo run this script you must have a valid VC and a valid signed VC JWT\n"
      );
      console.log(
        "\nPlease refer to issuer scripts to generate and sign a VC\n"
      );
    }
  } else {
    console.log("\nVC not found!\n");
    console.log(
      "\nTo run this script you must have a valid VC and a valid signed VC JWT\n"
    );
    console.log("\nPlease refer to issuer scripts to generate and sign a VC\n");
  }
};

createAndSignVp();
