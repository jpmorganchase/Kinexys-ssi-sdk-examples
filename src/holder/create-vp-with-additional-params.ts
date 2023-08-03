import { createPresentation } from "@inprd/ssi";
import fs from "fs";
import { camelCase } from "lodash";
import path from "path";
import { VC, VC_DIR_PATH, VP_DIR_PATH } from "../../config";
import { writeToFile } from "../utils/writer";

const createVp = () => {
  if (VC) {
    try {
      console.log("\nReading an existing verifiable credential\n");
      const vc = require(path.resolve(VC_DIR_PATH, VC));
      console.log(JSON.stringify(vc, null, 2));

      console.log("\nReading a existing signed VC JWT\n");
      const jwt = fs.readFileSync(
        path.resolve(VC_DIR_PATH, `${camelCase(VC)}.jwt`),
        "utf8"
      );
      console.log(jwt);

      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(new Date().getFullYear() + 1);

      const expirationDate = oneYearFromNow.toISOString();

      const vpOptions = {
        issuanceDate: new Date().toISOString(),
        expirationDate: expirationDate,
      };

      console.log("\nGenerating a VP with additional options\n");
      const vp = createPresentation(vc.credentialSubject.id, [jwt], vpOptions);
      console.log(vp);

      writeToFile(
        path.resolve(VP_DIR_PATH, `${camelCase(vc.type[1])}.json`),
        JSON.stringify(vp)
      );
    } catch (err) {
      console.log("\nFailed to fetch file\n");
      console.log(
        "\nTo run this script you must have a valid VC and a vaild signed VC JWT\n"
      );
      console.log(
        "\nPlease refer to issuer scripts to generate and sign a VC\n"
      );
    }
  } else {
    console.log("\nVC not found!\n");
    console.log(
      "\nTo run this script you must have a valid VC and a vaild signed VC JWT\n"
    );
    console.log("\nPlease refer to issuer scripts to generate and sign a VC\n");
  }
};

createVp();
