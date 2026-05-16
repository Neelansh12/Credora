<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    /**
     * Handle certificate upload.
     * Pipeline: validate → store file → hash → DB insert → JSON response
     */
    public function store(Request $request): JsonResponse
    {
        // ── Step 1: Validate input ───────────────────────────────────
        $validated = $request->validate([
            'student_name'     => 'required|string|max:255',
            'student_email'    => 'nullable|email|max:255',
            'certificate_name' => 'required|string|max:255',
            'certificate_file' => [
                'required',
                'file',
                'mimes:pdf',        // Only PDF allowed
                'max:5120',         // Max 5MB (5120 KB)
            ],
        ]);

        // ── Step 2: Store file privately ─────────────────────────────
        $file     = $request->file('certificate_file');
        $filePath = $file->store('certificates');

        // ── Step 3: Generate SHA-256 hash from the stored file ───────
        $fullPath = Storage::path($filePath);
        $hash     = hash_file('sha256', $fullPath);

        // ── Step 4: Check for duplicate (tamper detection) ───────────
        if (Certificate::where('certificate_hash', $hash)->exists()) {
            Storage::delete($filePath);
            return response()->json([
                'success' => false,
                'error'   => 'This certificate has already been issued. Duplicate detected via SHA-256 hash.',
            ], 409);
        }

        // ── Step 5: Insert into DB ───────────────────────────────────
        $certificate = Certificate::create([
            'issuer_id'        => 1,
            'student_name'     => $validated['student_name'],
            'student_email'    => $validated['student_email'] ?? null,
            'certificate_name' => $validated['certificate_name'],
            'certificate_hash' => $hash,
            'file_path'        => $filePath,
            'status'           => 'pending',
            'blockchain_status'=> 'pending',
            'issued_at'        => now(),
        ]);

        // ── Step 6: Return JSON ──────────────────────────────────────
        return response()->json([
            'success'          => true,
            'message'          => 'Certificate issued successfully!',
            'certificate_id'   => $certificate->id,
            'certificate_hash' => $hash,
            'tx_hash'          => $certificate->blockchain_tx,
        ]);
    }

    /**
     * Verify a certificate by its SHA-256 hash (JSON API).
     */
    public function verifyJson(Request $request): JsonResponse
    {
        $request->validate([
            'hash' => 'required|string|size:64',
        ]);

        $certificate = Certificate::with('issuer')
            ->where('certificate_hash', $request->hash)
            ->first();

        if (! $certificate) {
            return response()->json([
                'result'      => 'not_found',
                'certificate' => null,
            ]);
        }

        return response()->json([
            'result'      => $certificate->status,
            'certificate' => [
                'id'               => $certificate->id,
                'student_name'     => $certificate->student_name,
                'certificate_name' => $certificate->certificate_name,
                'certificate_hash' => $certificate->certificate_hash,
                'status'           => $certificate->status,
                'blockchain_status'=> $certificate->blockchain_status,
                'blockchain_tx'    => $certificate->blockchain_tx,
                'contract_address' => $certificate->contract_address,
                'issued_at'        => $certificate->issued_at,
                'issuer'           => $certificate->issuer?->name,
            ],
        ]);
    }

    /**
     * Show single certificate detail (JSON API).
     */
    public function showJson(int $id): JsonResponse
    {
        $certificate = Certificate::with('issuer')->find($id);

        if (! $certificate) {
            return response()->json(['error' => 'Certificate not found'], 404);
        }

        return response()->json([
            'certificate' => [
                'id'               => $certificate->id,
                'student_name'     => $certificate->student_name,
                'student_email'    => $certificate->student_email,
                'certificate_name' => $certificate->certificate_name,
                'certificate_hash' => $certificate->certificate_hash,
                'file_path'        => $certificate->file_path,
                'qr_token'         => $certificate->qr_token,
                'status'           => $certificate->status,
                'blockchain_status'=> $certificate->blockchain_status,
                'blockchain_tx'    => $certificate->blockchain_tx,
                'contract_address' => $certificate->contract_address,
                'issued_at'        => $certificate->issued_at,
                'anchored_at'      => $certificate->anchored_at,
                'issuer'           => $certificate->issuer?->name,
            ],
        ]);
    }

    /**
     * Revoke a certificate (JSON API).
     */
    public function revokeJson(Request $request): JsonResponse
    {
        $request->validate([
            'hash' => 'required|string|size:64',
        ]);

        $certificate = Certificate::where('certificate_hash', $request->hash)->first();

        if (! $certificate) {
            return response()->json(['error' => 'Certificate not found'], 404);
        }

        if ($certificate->status === 'revoked') {
            return response()->json(['error' => 'Certificate already revoked'], 409);
        }

        $certificate->update(['status' => 'revoked']);

        return response()->json([
            'success' => true,
            'message' => 'Certificate revoked successfully.',
        ]);
    }
}