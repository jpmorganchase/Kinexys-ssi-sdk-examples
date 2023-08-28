import {exit} from 'process';
import config from './claim-config.json'
import axios from 'axios';
import { EthrDIDMethod } from "@jpmorganchase/onyx-ssi-sdk"
import {fromString, toString} from 'uint8arrays'
import { hashSha256 } from 'jsontokens/lib/cryptoClients/sha256';
import secp256k1 from 'secp256k1'
import log from './logger';


async function claim() {
    try {
        log.info("Claiming from Issuance Service...");

        //Create DID (did:ethr) for Subject of VC
        const ethrDID = new EthrDIDMethod({
            name: config.web3.name,
            registry: config.web3.didRegistryAddress,
            rpcUrl: config.web3.web3HttpProvider
        })
        const subjectDID = await ethrDID.create()

        if (subjectDID === undefined) {
            log.error('Unable to register root DID');
            exit(1);
        }

        //Sign challenge required to claim by Issuance Service
        const timestamp = Date.now();
        const token = config.token;
        const did = subjectDID.did;
        const pubkey = subjectDID.keyPair.publicKey
        const privKey = subjectDID.keyPair.privateKey as string

        const data = `${token}\n${did}\n${timestamp}`

        const sig = signChallenge(data, privKey)

        
        //Hit claiming endpoint of Onyx Issuance Service
        log.info(`Requesting Credential from ${config.issuer} using token ${token}`);
        const credentialResponse = await axios.post(`${config.issuer}/public/issue`, {
            token: token,
            did: did,
            timestamp: timestamp,
            signature: sig,
        })
        const credentialJWT = credentialResponse.data;

        //Log out relevant information
        log.info('Credential Information for Subject');
        log.info(`DID: ${did}`);
        log.info(`Private Key: ${privKey}`);
        log.info(`Public Key : ${pubkey}`);
        log.info(`CredentialJWT: ${credentialJWT}`);
        log.info('************************************');

    } catch (err) {
        log.error(`Error encountered during setup. Aborting...`, err);
        exit(1);
    }

}

export function signChallenge(challenge: string, privateKey: string) : string {
    const sigobj = secp256k1.ecdsaSign(hashSha256(challenge), hexToBytes(privateKey))
    return bytesToHex(sigobj.signature).concat(':').concat(sigobj.recid.toString())
}

export function bytesToHex(bytes: Uint8Array) {
    return toString(bytes, 'base16')
}

export function hexToBytes(s: string): Uint8Array {
    const input = s.startsWith('0x') ? s.substring(2) : s
    return fromString(input.toLowerCase(), 'base16')
}



claim();