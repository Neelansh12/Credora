<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop old incomplete table first
        Schema::dropIfExists('certificates');

        Schema::create('certificates', function (Blueprint $table) {
            $table->id();

            // Ownership
            $table->foreignId('issuer_id')
                  ->constrained('users')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');

            // Certificate identity
            $table->string('student_name');
            $table->string('student_email')->nullable();
            $table->string('certificate_name');

            // Core cryptographic fields
            $table->char('certificate_hash', 64)
                  ->unique()
                  ->comment('SHA-256 hex fingerprint — always 64 chars');

            // Storage
            $table->string('file_path', 500);

            // QR verification token
            $table->char('qr_token', 64)
                  ->unique()
                  ->comment('Token used to build public QR verification URL');

            // App-level status
            $table->enum('status', ['pending', 'valid', 'suspicious', 'revoked'])
                  ->default('pending');

            // Blockchain-level status (separate concern!)
            $table->enum('blockchain_status', ['pending', 'anchored', 'failed'])
                  ->default('pending');

            // Blockchain data
            $table->string('contract_address', 42)->nullable();
            $table->string('blockchain_tx', 66)
                  ->nullable()
                  ->unique()
                  ->comment('Polygon tx hash: 0x + 64 hex chars');

            // Lifecycle timestamps
            $table->timestamp('issued_at')->nullable();
            $table->timestamp('anchored_at')->nullable();
            $table->timestamps(); // created_at + updated_at

            // Indexes for fast lookup
            $table->index('issuer_id');
            $table->index('status');
            $table->index('blockchain_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};