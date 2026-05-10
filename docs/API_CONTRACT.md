POST /api/certificates
REQUEST:
{
  "student_name": "Neelansh",
  "certificate_name": "BTech",
  "file": "pdf"
}
RESPONSE:
{
  "success": true,
  "certificate_id": 1,
  "hash": "abc123",
  "txHash": "0x456"
}

POST /api/verify
REQUEST:
{
  "hash": "abc123"
}
RESPONSE:
{
  "valid": true,
  "issuer": "LPU",
  "timestamp": "..."
}