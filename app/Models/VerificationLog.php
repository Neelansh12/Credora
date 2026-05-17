<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VerificationLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'certificate_id',
        'verified_by',
        'verification_method',
        'result',
        'verifier_ip',
        'user_agent',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
        ];
    }

    // ── Relationships ────────────────────────────────────────────────

    // Which certificate was verified
    public function certificate(): BelongsTo
    {
        return $this->belongsTo(Certificate::class, 'certificate_id');
    }

    // Who verified it (null = public/anonymous verification)
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    // ── Result Helpers ───────────────────────────────────────────────

    public function wasValid(): bool
    {
        return $this->result === 'valid';
    }

    public function wasFraud(): bool
    {
        return $this->result === 'invalid';
    }
}