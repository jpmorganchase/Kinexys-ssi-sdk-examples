import {
  createPresentation,
  getSubjectFromVP,
} from "@jpmorganchase/onyx-ssi-sdk";
import fs from "fs";
import { camelCase } from "lodash";
import path from "path";
import { VC, VC_DIR_PATH, VP_DIR_PATH } from "../../config";
import { writeToFile } from "../utils/writer";

const createVp = () => {
  if (VC) {
    try {
      console.log("\nReading an existing signed VC JWT\n");
      const signedVcJwt = fs.readFileSync(
        path.resolve(VC_DIR_PATH, `${camelCase(VC)}.jwt`),
        "utf8"
      );
      console.log(signedVcJwt);

      console.log("\nGeting User from VC\n");
      const holderDid = getSubjectFromVP(signedVcJwt);
      console.log(holderDid);

      console.log("\nGenerating a VP\n");
      const vp = createPresentation(holderDid!, [signedVcJwt]);
      console.log(vp);

      writeToFile(path.resolve(VP_DIR_PATH, `${VC}.json`), JSON.stringify(vp));
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

createVp();
