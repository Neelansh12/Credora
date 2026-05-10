<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CertificateController extends Controller
{
    //
    public function store(Request $request)
{
    $file = $request->file('certificate');

    $path = $file->store('certificates');

    $hash = hash_file('sha256', $file);

    Certificate::create([
        'student_name' => $request->student_name,

        'certificate_name' => $request->certificate_name,

        'certificate_hash' => $hash,

        'file_path' => $path
    ]);

    return back()->with('success', 'Certificate Stored');
}
}


