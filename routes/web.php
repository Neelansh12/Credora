<?php

use App\Http\Controllers\CertificateController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

// ── API Routes (JSON) ────────────────────────────────────────────────
// These are called by the React frontend via fetch()

Route::post('/upload', [CertificateController::class, 'store'])->name('upload.store');
Route::post('/verify', [CertificateController::class, 'verifyJson'])->name('verify.json');

Route::get('/api/dashboard', [DashboardController::class, 'index']);
Route::get('/api/certificate/{id}', [CertificateController::class, 'showJson']);
Route::post('/api/revoke', [CertificateController::class, 'revokeJson']);

// ── SPA Catch-all ────────────────────────────────────────────────────
// All frontend routes are handled by React Router.
// This must be the LAST route definition.
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');