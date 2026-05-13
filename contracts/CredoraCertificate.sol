// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CredoraCertificate
 * @dev Tamper-proof certificate registry on Polygon blockchain.
 *      Stores SHA-256 hashes of certificates issued via Credora platform.
 *      Each hash is permanently recorded with issuer address and timestamp.
 */
contract CredoraCertificate {

    // ── Owner ────────────────────────────────────────────────────────
    address public owner;

    // ── Data Structure ───────────────────────────────────────────────
    // Represents one certificate record stored on-chain
    struct Certificate {
        bytes32 hash;           // SHA-256 hash of the certificate file
        address issuedBy;       // Wallet address of the issuer
        uint256 issuedAt;       // Unix timestamp of issuance
        bool    isRevoked;      // Revocation flag
        string  certificateId;  // Laravel DB certificate ID (for cross-reference)
    }

    // ── Storage ──────────────────────────────────────────────────────
    // Main mapping: hash → Certificate record
    // bytes32 hash is the SHA-256 fingerprint passed from Laravel
    mapping(bytes32 => Certificate) private certificates;

    // Track all hashes ever issued (for enumeration)
    bytes32[] public allHashes;

    // Authorized issuers (only these wallets can issue certificates)
    mapping(address => bool) public authorizedIssuers;

    // ── Events ───────────────────────────────────────────────────────
    // Events are emitted on every state change — they are permanently
    // logged on the blockchain and queryable off-chain via ethers.js
    event CertificateIssued(
        bytes32 indexed hash,
        address indexed issuedBy,
        uint256 issuedAt,
        string  certificateId
    );

    event CertificateRevoked(
        bytes32 indexed hash,
        address indexed revokedBy,
        uint256 revokedAt
    );

    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);

    // ── Modifiers ────────────────────────────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "Credora: caller is not owner");
        _;
    }

    modifier onlyAuthorized() {
        require(
            authorizedIssuers[msg.sender] || msg.sender == owner,
            "Credora: caller is not authorized issuer"
        );
        _;
    }

    // ── Constructor ──────────────────────────────────────────────────
    constructor() {
        owner = msg.sender;
        // Owner is automatically an authorized issuer
        authorizedIssuers[msg.sender] = true;
        emit IssuerAuthorized(msg.sender);
    }

    // ── Core Functions ───────────────────────────────────────────────

    /**
     * @dev Issue a certificate by storing its SHA-256 hash on-chain.
     * @param _hash       SHA-256 hash of the certificate (as bytes32)
     * @param _certId     Laravel certificate ID for cross-reference
     *
     * Interview note: We store bytes32, NOT the full document.
     * This means the blockchain only holds the fingerprint —
     * sensitive student data stays in MySQL. This is the correct
     * architecture for GDPR-compliant blockchain systems.
     */
    function issueCertificate(
        bytes32 _hash,
        string  memory _certId
    ) external onlyAuthorized {
        // Prevent duplicate issuance
        require(
            certificates[_hash].issuedAt == 0,
            "Credora: certificate already issued"
        );

        certificates[_hash] = Certificate({
            hash:          _hash,
            issuedBy:      msg.sender,
            issuedAt:      block.timestamp,
            isRevoked:     false,
            certificateId: _certId
        });

        allHashes.push(_hash);

        emit CertificateIssued(_hash, msg.sender, block.timestamp, _certId);
    }

    /**
     * @dev Verify a certificate by its hash.
     * @param _hash SHA-256 hash to look up
     * @return exists     Whether this hash was ever issued
     * @return isRevoked  Whether it has been revoked
     * @return issuedBy   Wallet that issued it
     * @return issuedAt   Unix timestamp of issuance
     * @return certId     Laravel DB certificate ID
     *
     * This is a VIEW function — costs zero gas to call.
     * Anyone can verify without paying fees.
     */
    function verifyCertificate(bytes32 _hash)
        external
        view
        returns (
            bool    exists,
            bool    isRevoked,
            address issuedBy,
            uint256 issuedAt,
            string  memory certId
        )
    {
        Certificate memory cert = certificates[_hash];

        if (cert.issuedAt == 0) {
            return (false, false, address(0), 0, "");
        }

        return (
            true,
            cert.isRevoked,
            cert.issuedBy,
            cert.issuedAt,
            cert.certificateId
        );
    }

    /**
     * @dev Revoke a certificate — marks it as invalid on-chain permanently.
     * @param _hash SHA-256 hash of certificate to revoke
     *
     * Note: Revocation is permanent and immutable on blockchain.
     * Even after revocation, the issuance record still exists —
     * this is the audit trail.
     */
    function revokeCertificate(bytes32 _hash) external onlyAuthorized {
        require(
            certificates[_hash].issuedAt != 0,
            "Credora: certificate not found"
        );
        require(
            !certificates[_hash].isRevoked,
            "Credora: already revoked"
        );

        certificates[_hash].isRevoked = true;

        emit CertificateRevoked(_hash, msg.sender, block.timestamp);
    }

    // ── Admin Functions ──────────────────────────────────────────────

    /**
     * @dev Add an authorized issuer wallet address.
     *      Only the contract owner can authorize new issuers.
     */
    function authorizeIssuer(address _issuer) external onlyOwner {
        require(_issuer != address(0), "Credora: zero address");
        authorizedIssuers[_issuer] = true;
        emit IssuerAuthorized(_issuer);
    }

    /**
     * @dev Remove an authorized issuer.
     */
    function removeIssuer(address _issuer) external onlyOwner {
        authorizedIssuers[_issuer] = false;
        emit IssuerRevoked(_issuer);
    }

    /**
     * @dev Get total number of certificates ever issued.
     */
    function totalIssued() external view returns (uint256) {
        return allHashes.length;
    }
}