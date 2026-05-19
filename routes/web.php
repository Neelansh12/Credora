<?php

use App\Http\Controllers\CertificateController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// ── Auth Routes ──────────────────────────────────────────────────────

Route::post('/login', function (\Illuminate\Http\Request $request) {
    $credentials = $request->validate([
        'email'    => 'required|email',
        'password' => 'required|string',
    ]);

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();
        $user = Auth::user();
        return response()->json([
            'success' => true,
            'role'    => $user->role,
            'name'    => $user->name,
            'email'   => $user->email,
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'INVALID CREDENTIALS',
    ], 401);
});

Route::post('/register', function (\Illuminate\Http\Request $request) {
    $data = $request->validate([
        'name'     => 'required|string|max:255',
        'email'    => 'required|email|unique:users,email',
        'password' => 'required|string|min:8|confirmed', // needs password_confirmation field
    ]);

    $user = \App\Models\User::create([
        'name'      => $data['name'],
        'email'     => $data['email'],
        'password'  => bcrypt($data['password']),
        'role'      => 'user',       // ← always 'user' on self-registration
        'is_active' => true,
    ]);

    // Auto-login after registration
    \Illuminate\Support\Facades\Auth::login($user);
    $request->session()->regenerate();

    return response()->json([
        'success' => true,
        'role'    => $user->role,
        'name'    => $user->name,
        'email'   => $user->email,
    ]);
});

Route::post('/logout', function (\Illuminate\Http\Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return response()->json(['success' => true]);
});



Route::get('/api/me', function () {
    $user = Auth::user();
    if (!$user) {
        return response()->json(['authenticated' => false, 'role' => 'guest', 'name' => null, 'email' => null]);
    }
    return response()->json([
        'authenticated' => true,
        'role'          => $user->role,
        'name'          => $user->name,
        'email'         => $user->email,
    ]);
});

// ── API Routes (JSON) ────────────────────────────────────────────────

use App\Http\Controllers\AuthController;

Route::post('/api/register', [AuthController::class, 'register']);
Route::post('/api/login', [AuthController::class, 'login']);
Route::post('/api/logout', [AuthController::class, 'logout']);

// Public APIs
Route::post('/verify', [CertificateController::class, 'verifyJson'])->name('verify.json');
Route::get('/api/certificate/{id}', [CertificateController::class, 'showJson']);

// Protected APIs
Route::middleware('auth')->group(function () {
    Route::post('/upload', [CertificateController::class, 'store'])->name('upload.store');
    Route::get('/api/dashboard', [DashboardController::class, 'index']);
    Route::post('/api/revoke', [CertificateController::class, 'revokeJson']);
});

// ── SPA Catch-all (MUST BE LAST) ─────────────────────────────────────
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');