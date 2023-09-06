import {
  EthrDIDMethod,
  JWTService,
  KeyDIDMethod,
  getCredentialsFromVP,
  getSupportedResolvers,
  verifyCredentialJWT,
  verifyDID,
  verifyPresentationJWT,
} from "@jpmorganchase/onyx-ssi-sdk";
import fs from "fs";
import { camelCase } from "lodash";
import path from "path";
import { JwtPayload, VP, VP_DIR_PATH, ethrProvider } from "../../config";

const didKey = new KeyDIDMethod();
const didEthr = new EthrDIDMethod(ethrProvider);
const jwtService = new JWTService();

const verificationWithDates = async () => {
  // Instantiating the didResolver
  const didResolver = getSupportedResolvers([didKey, didEthr]);

  if (VP) {
    try {
      console.log("\nReading an existing signed VP JWT\n");
      const signedVpJwt = fs.readFileSync(
        path.resolve(VP_DIR_PATH, `${camelCase(VP)}.jwt`),
        "utf8"
      );
      console.log(signedVpJwt);

      console.log("\nVerifying VP JWT\n");
      // Inovking the verification fuction from the sdk
      // To know more about verification and api reference please refer to readme in src > verifier > readme.md in the sdk
      const isVpJwtValid = await verifyPresentationJWT(
        signedVpJwt,
        didResolver
      );

      if (isVpJwtValid) {
        console.log("\nVP JWT is Valid\n");

        console.log("\nGetting VC JWT from VP\n");

        const vcJwt = getCredentialsFromVP(signedVpJwt)[0].toString();

        const verificationCredentialPolicies = {
          issuanceDate: true,
          expirationDate: true,
          format: true,
        };

        //Verify Credential JWT
        const isVcJwtValid = await verifyCredentialJWT(
          vcJwt,
          didResolver,
          verificationCredentialPolicies
        );

        if (isVcJwtValid) {
          console.log("\nVC JWT is Valid\n");

          console.log("\nDecoding VC\n");

          const vc = jwtService.decodeJWT(vcJwt)?.payload as JwtPayload;
          console.log(vc);

          try {
            console.log("\nVerifying VC\n");

            const isVcVerified = await verifyDID(vc.jti!, didResolver);
            console.log(`\nVerification status: ${isVcVerified}\n`);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("Invalid VC JWT");
        }
      } else {
        console.log("Invalid VP JWT");
      }
    } catch (err) {
      console.log("\nFailed to fetch file\n");
      console.log(
        "\nTo run this script you must have a valid VP and a valid signed VP JWT\n"
      );
      console.log(
        "\nPlease refer to issuer scripts to generate and sign a VP\n"
      );
    }
  } else {
    console.log("\nVP not found!\n");
    console.log(
      "\nTo run this script you must have a valid VP and a valid signed VP JWT\n"
    );
    console.log("\nPlease refer to issuer scripts to generate and sign a VP\n");
  }
};

verificationWithDates();
