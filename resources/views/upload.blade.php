<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Credora — Issue Certificate</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, sans-serif; background: #f4f4f5; color: #18181b; }
        .container { max-width: 640px; margin: 48px auto; padding: 0 16px; }
        h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; }
        .subtitle { color: #71717a; font-size: 0.875rem; margin-bottom: 32px; }
        .card { background: #fff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 32px; }
        label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 6px; }
        input, select { width: 100%; padding: 10px 12px; border: 1px solid #d4d4d8;
            border-radius: 8px; font-size: 0.9rem; margin-bottom: 20px; outline: none; }
        input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        button { width: 100%; padding: 12px; background: #6366f1; color: #fff;
            border: none; border-radius: 8px; font-size: 1rem; font-weight: 600;
            cursor: pointer; }
        button:hover { background: #4f46e5; }
        .alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d;
            padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 0.875rem; }
        .alert-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626;
            padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 0.875rem; }
        .table-wrap { margin-top: 40px; }
        table { width: 100%; border-collapse: collapse; font-size: 0.8rem; background: #fff;
            border-radius: 12px; overflow: hidden; border: 1px solid #e4e4e7; }
        th { background: #f4f4f5; padding: 10px 12px; text-align: left; font-weight: 600; }
        td { padding: 10px 12px; border-top: 1px solid #f4f4f5; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
        .badge-pending  { background: #fef9c3; color: #854d0e; }
        .badge-valid    { background: #dcfce7; color: #15803d; }
        .badge-revoked  { background: #fee2e2; color: #dc2626; }
        .hash { font-family: monospace; font-size: 0.7rem; color: #6b7280; }
    </style>
</head>
<body>
<div class="container">
    <h1>🔐 Credora</h1>
    <p class="subtitle">Blockchain-Based Certificate Validation System</p>

    {{-- Success Message --}}
    @if(session('success'))
        <div class="alert-success">✅ {{ session('success') }}</div>
    @endif

    {{-- Validation Errors --}}
    @if($errors->any())
        <div class="alert-error">
            @foreach($errors->all() as $error)
                ❌ {{ $error }}<br>
            @endforeach
        </div>
    @endif

    {{-- Upload Form --}}
    <div class="card">
        <form action="{{ route('upload.store') }}" method="POST" enctype="multipart/form-data">
            @csrf

            <label for="student_name">Student Name *</label>
            <input type="text" id="student_name" name="student_name"
                   value="{{ old('student_name') }}" placeholder="e.g. Rahul Sharma" required>

            <label for="student_email">Student Email (optional)</label>
            <input type="email" id="student_email" name="student_email"
                   value="{{ old('student_email') }}" placeholder="e.g. rahul@example.com">

            <label for="certificate_name">Certificate / Degree Title *</label>
            <input type="text" id="certificate_name" name="certificate_name"
                   value="{{ old('certificate_name') }}" placeholder="e.g. B.Tech Computer Science" required>

            <label for="certificate_file">Certificate PDF * (max 5MB)</label>
            <input type="file" id="certificate_file" name="certificate_file"
                   accept=".pdf" required>

            <button type="submit">🔗 Issue Certificate on Blockchain</button>
        </form>
    </div>

    {{-- Recent Certificates Table --}}
    @if($certificates->count() > 0)
    <div class="table-wrap">
        <h2 style="font-size:1rem; margin-bottom:12px;">Recent Certificates</h2>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Certificate</th>
                    <th>Hash (first 16)</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($certificates as $cert)
                <tr>
                    <td>{{ $cert->id }}</td>
                    <td>{{ $cert->student_name }}</td>
                    <td>{{ $cert->certificate_name }}</td>
                    <td class="hash">{{ substr($cert->certificate_hash, 0, 16) }}...</td>
                    <td>
                        <span class="badge badge-{{ $cert->status }}">
                            {{ strtoupper($cert->status) }}
                        </span>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif
</div>
</body>
</html>