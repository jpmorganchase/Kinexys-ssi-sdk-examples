import { JWTService, createPresentation } from "@inprd/ssi";
import fs from "fs";
import { camelCase } from "lodash";
import path from "path";
import { JwtPayload, VC, VC_DIR_PATH, VP_DIR_PATH } from "../../config";
import { writeToFile } from "../utils/writer";

const createVp = () => {
  const jwtService = new JWTService();

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

      console.log("\nGenerating a VP\n");
      const vp = createPresentation(signedVc.sub!, [signedVcJwt]);
      console.log(vp);

      writeToFile(
        path.resolve(VP_DIR_PATH, `${camelCase(signedVc.vc.type[1])}.json`),
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
