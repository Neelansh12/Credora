<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'wallet_address',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_active'         => 'boolean',
        ];
    }

    // ── Relationships ────────────────────────────────────────────────

    // One issuer has issued many certificates
    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class, 'issuer_id');
    }

    // One user has performed many verifications
    public function verificationLogs(): HasMany
    {
        return $this->hasMany(VerificationLog::class, 'verified_by');
    }

    // One admin has revoked many certificates
    public function revocations(): HasMany
    {
        return $this->hasMany(Revocation::class, 'revoked_by');
    }

    // ── Role Helper Methods ──────────────────────────────────────────

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isIssuer(): bool
    {
        return $this->role === 'issuer' || $this->role === 'admin';
    }

    public function isVerifier(): bool
    {
        return $this->role === 'verifier';
    }

    public function isActive(): bool
    {
        return $this->is_active === true;
    }
}