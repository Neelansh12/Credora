<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Revocation extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'certificate_id',
        'revoked_by',
        'reason',
        'blockchain_tx',
        'revoked_at',
    ];

    protected function casts(): array
    {
        return [
            'revoked_at' => 'datetime',
        ];
    }

    // ── Relationships ────────────────────────────────────────────────

    // Which certificate this revocation belongs to
    public function certificate(): BelongsTo
    {
        return $this->belongsTo(Certificate::class, 'certificate_id');
    }

    // Which admin/issuer performed the revocation
    public function revokedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'revoked_by');
    }
}