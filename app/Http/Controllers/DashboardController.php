<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'role'          => 'guest',
                'total'         => 0,
                'recent'        => [],
                'valid_count'   => 0,
                'revoked_count' => 0,
                'pending_count' => 0,
            ]);
        }

        // Admin / Issuer — sees ALL certificates
        if ($user->role === 'admin' || $user->role === 'issuer') {
            $all = Certificate::latest()->get();
            return response()->json([
                'role'          => $user->role,
                'total'         => $all->count(),
                'valid_count'   => $all->where('status', 'valid')->count(),
                'revoked_count' => $all->where('status', 'revoked')->count(),
                'pending_count' => $all->where('status', 'pending')->count(),
                'recent'        => $all->take(10)->map(fn($c) => [
                    'id'               => $c->id,
                    'student_name'     => $c->student_name,
                    'certificate_name' => $c->certificate_name,
                    'certificate_hash' => $c->certificate_hash,
                    'status'           => $c->status,
                    'blockchain_tx'    => $c->blockchain_tx,
                    'issued_at'        => $c->created_at,
                ])->values(),
            ]);
        }

        // Regular user — sees only their own certificates
        $mine = Certificate::where('student_email', $user->email)->latest()->get();
        return response()->json([
            'role'          => 'user',
            'total'         => $mine->count(),
            'valid_count'   => $mine->where('status', 'valid')->count(),
            'revoked_count' => $mine->where('status', 'revoked')->count(),
            'pending_count' => 0,
            'recent'        => $mine->map(fn($c) => [
                'id'               => $c->id,
                'student_name'     => $c->student_name,
                'certificate_name' => $c->certificate_name,
                'certificate_hash' => $c->certificate_hash,
                'status'           => $c->status,
                'blockchain_tx'    => $c->blockchain_tx,
                'issued_at'        => $c->created_at,
            ])->values(),
        ]);
    }
}