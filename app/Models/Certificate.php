<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Certificate extends Model
{
    protected $fillable = [
        'issuer_id',
        'student_name',
        'student_email',
        'certificate_name',
        'certificate_hash',
        'file_path',
        'qr_token',
        'status',
        'blockchain_status',
        'contract_address',
        'blockchain_tx',
        'issued_at',
        'anchored_at',
    ];

    protected function casts(): array
    {
        return [
            'issued_at'   => 'datetime',
            'anchored_at' => 'datetime',
            'created_at'  => 'datetime',
            'updated_at'  => 'datetime',
        ];
    }

    // ── Auto-generate QR token before saving ────────────────────────
    // This runs automatically whenever a new Certificate is created.
    // We never want a null qr_token, so we generate it here safely.
    protected static function booted(): void
    {
        static::creating(function (Certificate $cert) {
            if (empty($cert->qr_token)) {
                // SHA-256 of a UUID gives us exactly 64 chars — matches CHAR(64)
                $cert->qr_token = hash('sha256', Str::uuid()->toString());
            }
        });
    }

    // ── Relationships ────────────────────────────────────────────────

    // Who issued this certificate
    public function issuer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issuer_id');
    }

    // Every blockchain transaction attempt for this certificate
    public function blockchainLogs(): HasMany
    {
        return $this->hasMany(BlockchainLog::class, 'certificate_id');
    }

    // Every time someone verified this certificate
    public function verificationLogs(): HasMany
    {
        return $this->hasMany(VerificationLog::class, 'certificate_id');
    }

    // The single revocation record (if exists)
    public function revocation(): HasOne
    {
        return $this->hasOne(Revocation::class, 'certificate_id');
    }

    // ── Status Helper Methods ────────────────────────────────────────

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isValid(): bool
    {
        return $this->status === 'valid';
    }

    public function isSuspicious(): bool
    {
        return $this->status === 'suspicious';
    }

    public function isRevoked(): bool
    {
        return $this->status === 'revoked';
    }

    public function isAnchored(): bool
    {
        return $this->blockchain_status === 'anchored';
    }

    public function isBlockchainPending(): bool
    {
        return $this->blockchain_status === 'pending';
    }

    public function isBlockchainFailed(): bool
    {
        return $this->blockchain_status === 'failed';
    }

    // ── Query Scopes ─────────────────────────────────────────────────
    // Usage: Certificate::anchored()->get()
    // Usage: Certificate::pendingChain()->get()

    public function scopeAnchored($query)
    {
        return $query->where('blockchain_status', 'anchored');
    }

    public function scopePendingChain($query)
    {
        return $query->where('blockchain_status', 'pending');
    }

    public function scopeValid($query)
    {
        return $query->where('status', 'valid');
    }

    public function scopeRevoked($query)
    {
        return $query->where('status', 'revoked');
    }
}