import dotenv from "dotenv";
import { ethers } from "ethers";
import { getEddsaPrivateKey, getEs256kPrivateKey } from "./src/utils/keygen";

dotenv.config();

const getParam = (name: string) => {
  const param = process.env[name];
  if (!param) {
    console.error(`\nConfig param '${name}' missing\n`);
    return null;
  }
  return param;
};

//Provider configs
export const NETWORK_RPC_URL = getParam("NETWORK_RPC_URL");
export const CHAIN_ID = parseInt(getParam("CHAIN_ID")!);
export const NETWORK_NAME = getParam("NETWORK_NAME");
export const REGISTRY_CONTRACT_ADDRESS = getParam("REGISTRY_CONTRACT_ADDRESS");

//Keys
export const ISSUER_EDDSA_PRIVATE_KEY =
  getParam("ISSUER_EDDSA_PRIVATE_KEY") ||
  getEddsaPrivateKey("ISSUER_EDDSA_PRIVATE_KEY");
export const ISSUER_ES256K_PRIVATE_KEY =
  getParam("ISSUER_ES256K_PRIVATE_KEY") ||
  getEs256kPrivateKey("ISSUER_ES256K_PRIVATE_KEY");
export const HOLDER_EDDSA_PRIVATE_KEY =
  getParam("HOLDER_EDDSA_PRIVATE_KEY") ||
  getEddsaPrivateKey("HOLDER_EDDSA_PRIVATE_KEY");
export const HOLDER_ES256K_PRIVATE_KEY =
  getParam("HOLDER_ES256K_PRIVATE_KEY") ||
  getEs256kPrivateKey("HOLDER_ES256K_PRIVATE_KEY");

//VC configs
export const VC_SCHEMA_URL = getParam("VC_SCHEMA_URL");
export const VC_DIR_PATH =
  getParam("VC_DIR_PATH") || "./src/verifiable_credentials";
export const VC = getParam("VC");
export const VC_ES256K_PRIVATE_KEY = getParam("VC_ES256K_PRIVATE_KEY");

//VP configs
export const VP_DIR_PATH =
  getParam("VP_DIR_PATH") || "./src/verifiable_presentation";
export const VP = getParam("VP");

export const provider = new ethers.providers.JsonRpcProvider(NETWORK_RPC_URL!);
export const ethrProvider = {
  name: NETWORK_NAME!,
  chainId: CHAIN_ID,
  rpcUrl: NETWORK_RPC_URL!,
  registry: REGISTRY_CONTRACT_ADDRESS!,
  gasSource: "",
};

export interface JwtPayload {
  [key: string]: any;
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
}
