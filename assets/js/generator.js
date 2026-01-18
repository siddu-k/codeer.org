function generateArticle(e) {
    e.preventDefault();

    const title = document.getElementById('art-title').value;
    const author = document.getElementById('art-author').value;
    const tag = document.getElementById('art-tag').value;
    const category = document.getElementById('art-category').value;
    const content = document.getElementById('art-content').value;

    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // HTML Template
    const htmlContent = `<!DOCTYPE html>
<html lang="en" class="bg-black">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Codeer</title>
    <base href="../../"> <!-- Adjust relative path for assets -->
    <link rel="stylesheet" href="assets/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Gugi&amp;family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&amp;display=swap" rel="stylesheet">
</head>
<body class="bg-black text-white">
    <!-- Navbar -->
    <header>
        <div class="container">
            <nav>
                <div class="nav-left">
                    <a href="home.html" class="nav-logo">
                        <img src="logo.png" alt="C" onerror="this.src='https://placehold.co/30x30'"> 
                        CODEER
                    </a>
                </div>
                <div class="nav-links">
                    <a href="home.html">Dashboard</a>
                    <a href="#" class="active">Articles</a>
                </div>
            </nav>
        </div>
    </header>

    <main style="padding-top: 120px;">
        <article class="container" style="max-width: 800px;">
            <div style="margin-bottom: 2rem;">
                <span style="color: var(--accent); font-size: 0.9rem; letter-spacing: 1px; text-transform: uppercase;">${category} / ${tag}</span>
                <h1 style="font-size: 3rem; margin-top: 0.5rem; line-height: 1.2;">${title}</h1>
                <div style="margin-top: 1rem; color: var(--text-dim); display: flex; align-items: center; gap: 1rem;">
                    <span>By @${author}</span>
                    <span>•</span>
                    <span>${date}</span>
                </div>
            </div>
            
            <div class="editor-content" style="font-family: var(--font-main); font-size: 1.1rem; line-height: 1.8; background: transparent; padding: 0;">
                ${content}
            </div>
        </article>
    </main>

    <footer style="margin-top: 4rem; text-align: center; border-top: 1px solid var(--glass-border); padding: 2rem;">
        <p style="color: var(--text-dim);">Codeer Community Content</p>
    </footer>
</body>
</html>`;

    // Create Download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
