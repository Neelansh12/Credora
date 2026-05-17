<?php

use App\Http\Controllers\CertificateController;
use Illuminate\Support\Facades\Route;

// Upload routes
Route::get('/upload',  [CertificateController::class, 'index'])->name('upload.index');
Route::post('/upload', [CertificateController::class, 'store'])->name('upload.store');

// Verification route
Route::get('/verify',  [CertificateController::class, 'verify'])->name('verify');

// Home redirect
Route::get('/', function () {
    return view('welcome');
});