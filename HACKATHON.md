# Onyx Use Cases
Onyx is looking for exciting web2 and web3 use cases. To help get you started, we have provided:
* Onyx Issuance Service to claim 2 types of Credentials
* DIDRegistry (did:ethr) deployed on Polygon testnet
* [Helper scripts](src/hackathon-scripts) that facilitate the claiming and presenting of the Onyx VCs
* [Sample verifier service](src/sample-verifier) to run locally

## Onyx Issuance Service
Onyx has deployed a service to issue 2 Credential types to Hackathon participants. The official Onyx DID for the Hackathon is:

For interested participants, Encode will send an OTP token to be used for claiming an Onyx Credential. This repo contains a claim script that can be used to claim the Onyx Credential. Once the token has been used and the Credential claimed, the token can no longer be used. Please keep your claimed Credentials in a safe location!

Each group can claim a maximum of 2 Credentials of the same type, one for testing/development and one for demo.

### Onyx Credential Types
Onyx is issuing 2 Credential types as a part of this Hackathon. In your request to Encode, please specify which Credential type you would like to claim. The claims in these Credentials are hardcoded and contain dummy data.

#### Verified Customer

VerifiedCustomer contains one claim: 

``` shell
"credentialSubject": {
  "name": "Natalie Garcia"
}
```
The Schema for this Credential is [here](https://github.com/jpmorganchase/onyx-ssi-sdk/blob/main/src/services/common/schemas/definitions/verifiedCustomer.json)

#### BalanceCredential

BalanceCredential contains 2 claims:

``` shell
"credentialSubject": {
  "name": "Natalie Garcia",
  "balance" "$6,000"
}
```
The Schema for this Credential is [here](https://github.com/jpmorganchase/onyx-ssi-sdk/blob/main/src/services/common/schemas/definitions/balanceCredential.json)

### DIDRegistry
For Onyx issued Credentials, [did:ethr](https://github.com/jpmorganchase/onyx-ssi-sdk/tree/main/src/services/common/did#didethr) will be used. The DIDRegistry for did:ethr used in this hackathon is deployed at address: 0x33C695F89ab8F8f169fa652AD9a896C4e4AD34eb. This is where your DIDs will be registered during the claiming process. If you would like to use a different DID method as your subject DID, you may modify the claim script from this repo.

### How to Claim a Credential
1. Inform Encode of the Credential type you would like to claim
2. Fork and clone this repo
3. Run `npm install` at the root of the repo
4. Update `claim-config.json` in `src/hackathon-scripts`: paste the OTP from Encode in the "token" field. The rest of the fields you will not need to modify.
5. Run `npm run claim` at the root of the repo which will print out your Credential represented as a JWT string
6. The claim script will also print out your DID and associated key pair. Keep them and the Credential in a safe place.

Sanity Checks: You can use this [site](https://jwt.io/) to decode your VC and perform sanity checks.
* The issuer did in the VC should be `did:ethr:maticmum:0x506bddCD71F100B32419Ff8aDEeCB0Bc30D13855` 
* The subject did in the VC should match the output of the claim script
* The `credentialSubject` should be populated with the above Dummy data. 
* The VC should contain a type of either `VerifiedCustomer` or `BalanceCredential`

## Building a Use Case
Now that you have claimed your VC, you can start building your solution. As a part of this Hackathon we do not supply a Wallet, but we do supply a sample Verifier backend to run locally. 

To demonstrate your use case we recommend you either simulate a Wallet with the given helper scripts or build a simple Web Wallet. 

### Simulate Wallet via Scripts
This branch contains a [sample Verifier service](src/sample-verifier/) and a [present-vc](src/hackathon-scripts/present-vc.ts) script. The script takes in your private key and the VC from the claim credential process. It will create a presentation for you and send it via http to a locally running Verifier service. You can build your use case off of the sample Verifier provided or write your own.

### Build a Simple Web Wallet
Instead of using scripts to simulate a Wallet flow, you have the option to build a simple Wallet service that interacts with your Verifier app.

### How to run the Verifier
The Verifier is just a backend service.

1. Navigate to the sample verifier project: `cd src/sample-verifier`
2. Run `npm run start` to start the Verifier service locally (default is port `4000`)
3. Update `present-config.json` in `src/hackathon-scripts`: paste the VC in "credential" field, your private key in "privateKey", and make sure "verifierUrl" is pointing to the correct location
4. In a separate terminal, run `npm run present` from the root of this repo which will create a Verifiable Presentation and send it to the Verifier
5. Check your Verifier logs to see that the verification was successful
