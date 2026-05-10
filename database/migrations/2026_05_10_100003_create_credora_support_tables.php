<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── blockchain_logs ──────────────────────────────────────────
        Schema::create('blockchain_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('certificate_id')
                  ->constrained('certificates')
                  ->onDelete('cascade');
            $table->enum('action', ['issue', 'revoke', 'verify']);
            $table->string('tx_hash', 66)->nullable();
            $table->enum('tx_status', ['pending', 'confirmed', 'failed'])
                  ->default('pending');
            $table->unsignedBigInteger('gas_used')->nullable();
            $table->unsignedBigInteger('block_number')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('attempted_at')->useCurrent();
            $table->timestamp('confirmed_at')->nullable();

            $table->index('certificate_id');
            $table->index('tx_status');
        });

        // ── verification_logs ────────────────────────────────────────
        Schema::create('verification_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('certificate_id')
                  ->constrained('certificates')
                  ->onDelete('cascade');
            $table->foreignId('verified_by')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('set null');
            $table->enum('verification_method', ['hash', 'qr', 'api'])
                  ->default('hash');
            $table->enum('result', ['valid', 'invalid', 'revoked', 'not_found']);
            $table->string('verifier_ip', 45)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->timestamp('verified_at')->useCurrent();

            $table->index('certificate_id');
            $table->index('result');
            $table->index('verified_at');
        });

        // ── revocations ──────────────────────────────────────────────
        Schema::create('revocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('certificate_id')
                  ->constrained('certificates')
                  ->onDelete('restrict')
                  ->unique(); // one revocation record per certificate
            $table->foreignId('revoked_by')
                  ->constrained('users')
                  ->onDelete('restrict');
            $table->text('reason');
            $table->string('blockchain_tx', 66)->nullable();
            $table->timestamp('revoked_at')->useCurrent();

            $table->index('revoked_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('revocations');
        Schema::dropIfExists('verification_logs');
        Schema::dropIfExists('blockchain_logs');
    }
};