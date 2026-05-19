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
        $user = \Illuminate\Support\Facades\Auth::user();
        $query = Certificate::query();

        // If the user is not an admin, only show their own certificates
        if ($user && $user->role === 'user') {
            $query->where('student_email', $user->email);
        }

        $totalIssued  = (clone $query)->count();
        $validCount   = (clone $query)->where('status', 'valid')->count();
        $revokedCount = (clone $query)->where('status', 'revoked')->count();
        $pendingCount = (clone $query)->where('status', 'pending')->count();

        $recentCertificates = (clone $query)->with('issuer')
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
