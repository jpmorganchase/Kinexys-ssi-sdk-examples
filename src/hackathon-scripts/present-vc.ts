import {exit} from 'process';
import config from './present-config.json'
import axios from 'axios';
import { createAndSignPresentationJWT, EthrDIDMethod } from "@jpmorganchase/onyx-ssi-sdk"
import log from './logger';


async function setup() {
    try {
        log.info("Creating Verifiable Presentation...");
        const signingKey = config.privateKey
        const vcs = config.vcs

        //get DID (did:ethr) from configured private key
        const ethrDID = new EthrDIDMethod({
            name: config.web3.name,
            registry: config.web3.didRegistryAddress,
            rpcUrl: config.web3.web3HttpProvider
        })
        const subjectDID = await ethrDID.generateFromPrivateKey(signingKey)

        //create VP
        const vp = await createAndSignPresentationJWT(subjectDID, vcs)

        
        //Hit claim endpoint of Onyx Issuance Service
        log.info(`Sending Verifiable Presentation to Verifier at ${config.verifierUrl}`)
        const verificationResponse = await axios.post(`${config.verifierUrl}/verify`, 
        {presentation: vp})
        const verified = verificationResponse.data;

        //Log out relevant information
        log.info(`Verification Result: ${verified}`)

    } catch (err) {
        log.error(`Error encountered during setup. Aborting...`, err);
        exit(1);
    }

}


setup();