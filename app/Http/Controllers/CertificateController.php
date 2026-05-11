<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    /**
     * Show the upload form.
     */
    public function index()
    {
        $certificates = Certificate::with('issuer')
            ->latest()
            ->paginate(10);

        return view('upload', compact('certificates'));
    }

    /**
     * Handle certificate upload.
     * Pipeline: validate → store file → hash → DB insert → redirect
     */
    public function store(Request $request): RedirectResponse
    {
        // ── Step 1: Validate input ───────────────────────────────────
        // Never trust client input. Validate everything strictly.
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
        // storage/app/certificates/ — NOT publicly accessible.
        // Never store certificates in public/ — they are sensitive documents.
        $file     = $request->file('certificate_file');
        $filePath = $file->store('certificates');
        // $filePath is relative: "certificates/randomname.pdf"

        // ── Step 3: Generate SHA-256 hash from the stored file ───────
        // We hash AFTER storing so the hash matches the persisted artifact.
        // hash_file() reads the file from disk and computes SHA-256.
        // Output: 64-character lowercase hex string → matches CHAR(64) column.
        $fullPath = Storage::path($filePath);
        $hash     = hash_file('sha256', $fullPath);

        // ── Step 4: Check for duplicate (tamper detection) ───────────
        // If this exact file was already issued, the hash will match.
        // This is a core security feature — same file = same hash always.
        if (Certificate::where('certificate_hash', $hash)->exists()) {
            // Delete the duplicate file we just stored
            Storage::delete($filePath);

            return redirect('/upload')
                ->withErrors(['certificate_file' => 'This certificate has already been issued. Duplicate detected via SHA-256 hash.'])
                ->withInput();
        }

        // ── Step 5: Insert into DB ───────────────────────────────────
        // issuer_id = 1 (our seeded admin) — hardcoded for now.
        // After auth is added, this becomes: auth()->id()
        $certificate = Certificate::create([
            'issuer_id'        => 1,
            'student_name'     => $validated['student_name'],
            'student_email'    => $validated['student_email'] ?? null,
            'certificate_name' => $validated['certificate_name'],
            'certificate_hash' => $hash,
            'file_path'        => $filePath,
            // qr_token is auto-generated in Certificate::booted()
            'status'           => 'pending',
            'blockchain_status'=> 'pending',
            'issued_at'        => now(),
        ]);

        // ── Step 6: Redirect with success ───────────────────────────
        return redirect('/upload')
            ->with('success', "Certificate issued! ID: {$certificate->id} | Hash: {$hash}");
    }

    /**
     * Verify a certificate by its SHA-256 hash.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'hash' => 'required|string|size:64',
        ]);

        $certificate = Certificate::with('issuer')
            ->where('certificate_hash', $request->hash)
            ->first();

        if (! $certificate) {
            return view('verify', [
                'result'      => 'not_found',
                'certificate' => null,
            ]);
        }

        return view('verify', [
            'result'      => $certificate->status,
            'certificate' => $certificate,
        ]);
    }
}