<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlockchainLog extends Model
{
    // This table uses custom timestamp columns, not Laravel's default
    public $timestamps = false;

    protected $fillable = [
        'certificate_id',
        'action',
        'tx_hash',
        'tx_status',
        'gas_used',
        'block_number',
        'error_message',
        'attempted_at',
        'confirmed_at',
    ];

    protected function casts(): array
    {
        return [
            'attempted_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'gas_used'     => 'integer',
            'block_number' => 'integer',
        ];
    }

    // ── Relationships ────────────────────────────────────────────────

    public function certificate(): BelongsTo
    {
        return $this->belongsTo(Certificate::class, 'certificate_id');
    }

    // ── Status Helpers ───────────────────────────────────────────────

    public function isConfirmed(): bool
    {
        return $this->tx_status === 'confirmed';
    }

    public function isFailed(): bool
    {
        return $this->tx_status === 'failed';
    }

    public function isPending(): bool
    {
        return $this->tx_status === 'pending';
    }
}
