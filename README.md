# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```


# Credora Chain

## Deployed Contract
- Network: Polygon Amoy Testnet
- Chain ID: 80002
- Contract Address: 0xfE2e5b70EB94f2A7E54Cc6508885d48dCd2042c4
- Explorer: https://amoy.polygonscan.com/address/0xfE2e5b70EB94f2A7E54Cc6508885d48dCd2042c4

## Contract Functions
| Function | Type | Purpose |
|---|---|---|
| issueCertificate(bytes32, string) | write | Anchor certificate hash on-chain |
| verifyCertificate(bytes32) | read (free) | Verify a hash exists on-chain |
| revokeCertificate(bytes32) | write | Mark certificate as revoked |
| totalIssued() | read (free) | Count total certificates issued |

## Setup
1. npm install
2. Copy .env.example to .env and fill values
3. npx hardhat compile
4. npx hardhat run scripts/deploy.js --network amoy