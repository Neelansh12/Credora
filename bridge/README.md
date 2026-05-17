# 🌉 Credora Bridge — Node.js API

Connects the Laravel backend to the **CredoraCertificate** smart contract on **Polygon Amoy Testnet**.

---

## 📁 Folder Structure

```
credora-bridge/
├── index.js                     ← Express server entry point
├── routes/
│   └── certificate.js           ← All API route handlers
├── services/
│   └── blockchain.js            ← ethers.js blockchain logic
├── abis/
│   └── CredoraCertificate.json  ← Smart contract ABI (from Neelansh)
├── .env                         ← Your secrets (never commit this!)
├── .env.example                 ← Template — copy to .env
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create your `.env` file
```bash
cp .env.example .env
```
Then edit `.env` and fill in your `ISSUER_PRIVATE_KEY`.

### 3. Start the server
```bash
# Development (auto-restarts on file change)
npm run dev

# Production
npm start
```

---

## 🌐 API Endpoints

### Health Check
```
GET http://localhost:3001/health
```
Returns server status, contract address, and network info.

---

### Anchor Certificate (called by Laravel after saving to DB)
```
POST http://localhost:3001/api/anchor
Content-Type: application/json

{
  "hash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
  "certificate_id": "1"
}
```
**Response:**
```json
{
  "success": true,
  "tx_hash": "0xabc123...",
  "message": "Certificate anchored on Polygon Amoy",
  "explorer": "https://amoy.polygonscan.com/tx/0xabc123..."
}
```

---

### Verify Certificate (free read — no gas)
```
GET http://localhost:3001/api/verify/{sha256hash}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "exists": true,
    "isRevoked": false,
    "issuedBy": "0xYourWalletAddress",
    "issuedAt": 1715000000,
    "issuedAtISO": "2024-05-06T12:00:00.000Z",
    "certId": "1",
    "explorer": "https://amoy.polygonscan.com/address/0xContract..."
  }
}
```

---

### Revoke Certificate
```
POST http://localhost:3001/api/revoke
Content-Type: application/json

{
  "hash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
}
```
**Response:**
```json
{
  "success": true,
  "tx_hash": "0xdef456...",
  "message": "Certificate revoked on blockchain",
  "explorer": "https://amoy.polygonscan.com/tx/0xdef456..."
}
```

---

### Get Total Issued (from contract)
```
GET http://localhost:3001/api/total
```

---

### Check Authorized Issuer
```
GET http://localhost:3001/api/issuer/{walletAddress}
```

---

## 🔗 Laravel Integration

Laravel calls this bridge at two points:

1. **After issuing a certificate** → `POST /api/anchor` → saves returned `tx_hash` to MySQL
2. **When verifying a certificate** → `GET /api/verify/:hash` → checks blockchain status

```php
// In CertificateController::store() — after saving to DB
$response = Http::post('http://localhost:3001/api/anchor', [
    'hash'           => $certificate->sha256_hash,
    'certificate_id' => $certificate->id,
]);
$txHash = $response->json('tx_hash');
$certificate->update(['blockchain_tx' => $txHash, 'status' => 'anchored']);
```

```php
// In VerificationController::verify()
$response = Http::get("http://localhost:3001/api/verify/{$hash}");
$data = $response->json('data');
```

---

## 🔐 Environment Variables

| Variable              | Description                                      |
|-----------------------|--------------------------------------------------|
| `PORT`                | Bridge server port (default: 3001)               |
| `POLYGON_AMOY_RPC_URL`| Polygon Amoy RPC endpoint                        |
| `CONTRACT_ADDRESS`    | Deployed CredoraCertificate contract address     |
| `ISSUER_PRIVATE_KEY`  | Private key of authorized issuer wallet ⚠️       |
| `LARAVEL_URL`         | Laravel backend URL for CORS whitelist           |

---

## 🧪 Testing with Postman

Import and test these requests:

1. `GET  http://localhost:3001/health`
2. `POST http://localhost:3001/api/anchor` — with body above
3. `GET  http://localhost:3001/api/verify/<hash>`
4. `POST http://localhost:3001/api/revoke` — with body above

---

## ⛓️ Contract Details

- **Network:** Polygon Amoy Testnet (Chain ID: 80002)
- **Contract:** CredoraCertificate
- **Address:** `0xfE2e5b70EB94f2A7E54Cc6508885d48dCd2042c4`
- **Explorer:** https://amoy.polygonscan.com/address/0xfE2e5b70EB94f2A7E54Cc6508885d48dCd2042c4

---

## 🚢 Git

```bash
git add .
git commit -m "feat: Node.js bridge API — anchor, verify, revoke endpoints"
git push origin blockchain
```
> Work on the `blockchain` branch inside a `/bridge` subfolder, or a separate `bridge` branch.
