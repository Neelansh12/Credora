<?php

use App\Http\Controllers\CertificateController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

// ── API Routes (JSON) ────────────────────────────────────────────────
// These are called by the React frontend via fetch()

use App\Http\Controllers\AuthController;

Route::post('/api/register', [AuthController::class, 'register']);
Route::post('/api/login', [AuthController::class, 'login']);
Route::post('/api/logout', [AuthController::class, 'logout']);

// Public APIs
Route::post('/verify', [CertificateController::class, 'verifyJson'])->name('verify.json');
Route::get('/api/certificate/{id}', [CertificateController::class, 'showJson']);

// Protected APIs
Route::middleware('auth')->group(function () {
    Route::get('/api/me', [AuthController::class, 'me']);
    Route::post('/upload', [CertificateController::class, 'store'])->name('upload.store');
    Route::get('/api/dashboard', [DashboardController::class, 'index']);
    Route::post('/api/revoke', [CertificateController::class, 'revokeJson']);
});

// ── SPA Catch-all ────────────────────────────────────────────────────
// All frontend routes are handled by React Router.
// This must be the LAST route definition.
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');