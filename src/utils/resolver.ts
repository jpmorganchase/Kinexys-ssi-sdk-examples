import {
  EthrDIDMethod,
  KeyDIDMethod,
  getSupportedResolvers,
} from "@jpmorganchase/onyx-ssi-sdk";
import { Resolvable } from "did-resolver";
import { ethrProvider, VIDOS_API_KEY, VIDOS_RESOLVER_URL } from "../../config";
import { VidosResolver } from "./vidosResolver";

/**
 * Utility method for creation of DID resolver and DID methods.
 * If there is configuration for Vidos, it will create a VidosResolver, otherwise it will create a resolver with the `getDIDResolver` method from the supported DID methods.
 */
export function createDidResolver() {
  const keyDidMethod = new KeyDIDMethod();
  const ethrDidMethod = new EthrDIDMethod(ethrProvider);
  let didResolver: Resolvable;

  if (VIDOS_API_KEY || VIDOS_RESOLVER_URL) {
    if (VIDOS_API_KEY && VIDOS_RESOLVER_URL) {
      didResolver = new VidosResolver(VIDOS_RESOLVER_URL, VIDOS_API_KEY);
    } else {
      throw new Error(
        "Cannot create VidosResolver, VIDOS_API_KEY and VIDOS_RESOLVER_URL must be set together"
      );
    }
  } else {
    didResolver = getSupportedResolvers([]);
  }

  return {
    didMethods: { key: keyDidMethod, ethr: ethrDidMethod },
    didResolver,
  };
}
