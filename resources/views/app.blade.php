<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="Credora — Blockchain-Based Certificate Validation System on Polygon Amoy Testnet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <title>Credora — Blockchain Certificate Validation</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><polygon points='16,2 28,9 28,23 16,30 4,23 4,9' fill='%23020408' stroke='%2300f5d4' stroke-width='2'/><text x='16' y='20' text-anchor='middle' fill='%2300f5d4' font-size='14' font-family='monospace' font-weight='bold'>C</text></svg>">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/CredoraApp.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
