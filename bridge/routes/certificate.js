const express = require("express");
const router = express.Router();

const {
  anchorCertificate,
  verifyCertificate,
  revokeCertificate,
  getTotalIssued,
  isAuthorizedIssuer,
} = require("../services/blockchain");

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/anchor
//  Called by Laravel CertificateController::store() after saving to DB.
//  Body: { hash: "sha256hexstring", certificate_id: "123" }
//  Returns: { success, tx_hash, message }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/anchor", async (req, res) => {
  try {
    const { hash, certificate_id } = req.body;

    if (!hash || !certificate_id) {
      return res.status(400).json({
        success: false,
        error: "Both 'hash' and 'certificate_id' are required.",
      });
    }

    // Validate hash looks like a SHA-256 hex string (64 hex chars)
    const cleanHash = hash.replace(/^0x/, "");
    if (!/^[a-fA-F0-9]{64}$/.test(cleanHash)) {
      return res.status(400).json({
        success: false,
        error: "Invalid SHA-256 hash format. Expected 64 hex characters.",
      });
    }

    console.log(`[ANCHOR] Anchoring certificate ID: ${certificate_id}, hash: ${cleanHash}`);

    const txHash = await anchorCertificate(cleanHash, certificate_id);

    console.log(`[ANCHOR] ✅ Success — TX: ${txHash}`);

    return res.status(200).json({
      success:  true,
      tx_hash:  txHash,
      message:  "Certificate anchored on Polygon Amoy",
      explorer: `https://amoy.polygonscan.com/tx/${txHash}`,
    });
  } catch (error) {
    console.error("[ANCHOR] ❌ Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/verify/:hash
//  Called by Laravel VerificationController.
//  Param: hash — SHA-256 hex string (with or without 0x prefix)
//  Returns: { success, data: { exists, isRevoked, issuedBy, issuedAt, certId } }
// ─────────────────────────────────────────────────────────────────────────────
router.get("/verify/:hash", async (req, res) => {
  try {
    const { hash } = req.params;

    const cleanHash = hash.replace(/^0x/, "");
    if (!/^[a-fA-F0-9]{64}$/.test(cleanHash)) {
      return res.status(400).json({
        success: false,
        error: "Invalid SHA-256 hash format. Expected 64 hex characters.",
      });
    }

    console.log(`[VERIFY] Verifying hash: ${cleanHash}`);

    const result = await verifyCertificate(cleanHash);

    console.log(`[VERIFY] Result — exists: ${result.exists}, revoked: ${result.isRevoked}`);

    return res.status(200).json({
      success: true,
      data: {
        ...result,
        // Convert unix timestamp to ISO string for Laravel convenience
        issuedAtISO: result.issuedAt ? new Date(result.issuedAt * 1000).toISOString() : null,
        explorer: result.exists
          ? `https://amoy.polygonscan.com/address/${process.env.CONTRACT_ADDRESS}`
          : null,
      },
    });
  } catch (error) {
    console.error("[VERIFY] ❌ Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/revoke
//  Called by Laravel when admin revokes a certificate.
//  Body: { hash: "sha256hexstring" }
//  Returns: { success, tx_hash, message }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/revoke", async (req, res) => {
  try {
    const { hash } = req.body;

    if (!hash) {
      return res.status(400).json({
        success: false,
        error: "'hash' is required.",
      });
    }

    const cleanHash = hash.replace(/^0x/, "");
    if (!/^[a-fA-F0-9]{64}$/.test(cleanHash)) {
      return res.status(400).json({
        success: false,
        error: "Invalid SHA-256 hash format. Expected 64 hex characters.",
      });
    }

    console.log(`[REVOKE] Revoking hash: ${cleanHash}`);

    const txHash = await revokeCertificate(cleanHash);

    console.log(`[REVOKE] ✅ Success — TX: ${txHash}`);

    return res.status(200).json({
      success:  true,
      tx_hash:  txHash,
      message:  "Certificate revoked on blockchain",
      explorer: `https://amoy.polygonscan.com/tx/${txHash}`,
    });
  } catch (error) {
    console.error("[REVOKE] ❌ Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/total
//  Returns total certificates issued on-chain (free read call).
// ─────────────────────────────────────────────────────────────────────────────
router.get("/total", async (req, res) => {
  try {
    const total = await getTotalIssued();
    return res.status(200).json({ success: true, total });
  } catch (error) {
    console.error("[TOTAL] ❌ Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/issuer/:address
//  Check if a wallet address is an authorized issuer.
// ─────────────────────────────────────────────────────────────────────────────
router.get("/issuer/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const authorized = await isAuthorizedIssuer(address);
    return res.status(200).json({ success: true, address, authorized });
  } catch (error) {
    console.error("[ISSUER] ❌ Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
