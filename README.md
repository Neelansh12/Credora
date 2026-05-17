# Credora Chain

Blockchain-powered certificate validation system built using Laravel, Hardhat, and Polygon.

---

## Tech Stack

- Laravel (Backend APIs & Dashboard)
- Hardhat (Smart Contract Development)
- Solidity
- Polygon Amoy Testnet
- MySQL
- React / Frontend

---

## Laravel Backend

Laravel powers the backend services, APIs, authentication, and certificate management dashboard.

### Features

- Secure API handling
- Database ORM with Eloquent
- Authentication & authorization
- Queue & event support
- Scalable MVC architecture

Learn more at:
https://laravel.com/docs

---

## Blockchain Smart Contract

This project also includes a Solidity smart contract deployed using Hardhat.

### Deployed Contract

- Network: Polygon Amoy Testnet
- Chain ID: 80002
- Contract Address: `0xfE2e5b70EB94f2A7E54Cc6508885d48dCd2042c4`

### Explorer

https://amoy.polygonscan.com/address/0xfE2e5b70EB94f2A7E54Cc6508885d48dCd2042c4

---

## Contract Functions

| Function | Type | Purpose |
|---|---|---|
| issueCertificate(bytes32, string) | write | Anchor certificate hash on-chain |
| verifyCertificate(bytes32) | read | Verify certificate authenticity |
| revokeCertificate(bytes32) | write | Revoke certificate |
| totalIssued() | read | Total certificates issued |

---

## Hardhat Commands

```bash
npx hardhat help
npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
composer install
```

### 2. Configure Environment

Copy:

```bash
.env.example -> .env
```

Fill all required credentials.

---

### 3. Compile Smart Contracts

```bash
npx hardhat compile
```

---

### 4. Run Laravel Server

```bash
php artisan serve
```

---

### 5. Deploy Contract

```bash
npx hardhat run scripts/deploy.js --network amoy
```

---

## License

This project is open-sourced under the MIT License.