<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Return dashboard statistics and recent certificates as JSON.
     */
    public function index(): JsonResponse
    {
        $totalIssued  = Certificate::count();
        $validCount   = Certificate::where('status', 'valid')->count();
        $revokedCount = Certificate::where('status', 'revoked')->count();
        $pendingCount = Certificate::where('status', 'pending')->count();

        $recentCertificates = Certificate::with('issuer')
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($cert) => [
                'id'               => $cert->id,
                'student_name'     => $cert->student_name,
                'certificate_name' => $cert->certificate_name,
                'certificate_hash' => $cert->certificate_hash,
                'status'           => $cert->status,
                'blockchain_status'=> $cert->blockchain_status,
                'blockchain_tx'    => $cert->blockchain_tx,
                'issued_at'        => $cert->issued_at,
            ]);

        return response()->json([
            'total_issued'        => $totalIssued,
            'valid_count'         => $validCount,
            'revoked_count'       => $revokedCount,
            'pending_count'       => $pendingCount,
            'recent_certificates' => $recentCertificates,
        ]);
    }
}
