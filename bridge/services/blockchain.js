const { ethers } = require("ethers");
require("dotenv").config();

const contractABI = require("../abis/CredoraCertificate.json").abi;

// ── Provider & Wallet ──────────────────────────────────────────────────────────
const provider = new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC_URL);
const wallet = new ethers.Wallet(process.env.ISSUER_PRIVATE_KEY, provider);

// ── Contract Instance ──────────────────────────────────────────────────────────
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  wallet
);

// ── Helper: convert hex string → bytes32 ──────────────────────────────────────
function toBytes32(hexHash) {
  const clean = hexHash.startsWith("0x") ? hexHash : "0x" + hexHash;
  return ethers.zeroPadValue(clean, 32);
}

/**
 * Anchor a certificate hash on-chain.
 * Calls: issueCertificate(bytes32 _hash, string _certId)
 *
 * @param {string}        sha256Hash - SHA-256 hex string from Laravel
 * @param {string|number} certId     - Laravel DB certificate ID
 * @returns {string}                 - Blockchain transaction hash
 */
async function anchorCertificate(sha256Hash, certId) {
  const hashBytes32 = toBytes32(sha256Hash);
  const tx = await contract.issueCertificate(hashBytes32, certId.toString());
  const receipt = await tx.wait(1); // wait for 1 block confirmation
  return receipt.hash;
}

/**
 * Verify a certificate hash on-chain (read-only — zero gas cost).
 * Calls: verifyCertificate(bytes32 _hash)
 * Returns: (bool exists, bool isRevoked, address issuedBy, uint256 issuedAt, string certId)
 *
 * @param {string} sha256Hash - SHA-256 hex string to verify
 * @returns {object}          - Verification result
 */
async function verifyCertificate(sha256Hash) {
  const hashBytes32 = toBytes32(sha256Hash);
  const result = await contract.verifyCertificate(hashBytes32);
  return {
    exists:    result[0],
    isRevoked: result[1],
    issuedBy:  result[2],
    issuedAt:  Number(result[3]),
    certId:    result[4],
  };
}

/**
 * Revoke a certificate on-chain.
 * Calls: revokeCertificate(bytes32 _hash)
 *
 * @param {string} sha256Hash - SHA-256 hex string to revoke
 * @returns {string}          - Blockchain transaction hash
 */
async function revokeCertificate(sha256Hash) {
  const hashBytes32 = toBytes32(sha256Hash);
  const tx = await contract.revokeCertificate(hashBytes32);
  const receipt = await tx.wait(1);
  return receipt.hash;
}

/**
 * Get total certificates issued on-chain (read-only).
 * Calls: totalIssued()
 *
 * @returns {number} - Total count from the smart contract
 */
async function getTotalIssued() {
  const total = await contract.totalIssued();
  return Number(total);
}

/**
 * Check if a wallet address is an authorized issuer (read-only).
 * Calls: authorizedIssuers(address)
 *
 * @param {string} address - Wallet address to check
 * @returns {boolean}
 */
async function isAuthorizedIssuer(address) {
  return await contract.authorizedIssuers(address);
}

module.exports = {
  anchorCertificate,
  verifyCertificate,
  revokeCertificate,
  getTotalIssued,
  isAuthorizedIssuer,
};
