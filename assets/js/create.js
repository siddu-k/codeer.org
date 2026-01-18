/**
 * Codeer Content Generator v2
 * Handles article generation and template downloads.
 */

// Editor Commands
function formatDoc(cmd, value = null) {
    if (value) {
        document.execCommand(cmd, false, value);
    } else {
        document.execCommand(cmd);
    }
}

// Generate Article from Editor
function generateArticle(e) {
    e.preventDefault();

    // Get form values
    const title = document.getElementById('art-title').value;
    const author = document.getElementById('art-author').value;
    const items = document.getElementById('art-category').value.split('/');
    const category = items[0];
    const subCategory = items[1] || 'general';

    // Get HTML from ContentEditable
    const content = document.getElementById('editor').innerHTML;

    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filename = `${slug}.html`;

    // Template
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Codeer</title>
    <base href="../../../">
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/components.css">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>

    <nav class="navbar">
        <div class="container nav-con">
            <a href="home.html" class="flex items-center gap-2" style="font-family: var(--font-logo); font-size: 1.25rem; color: #fff;">
                <img src="assets/images/logo.png" width="24" height="24" alt="C"> CODEER
            </a>
            <div class="nav-links">
                <a href="home.html" class="nav-link">Dashboard</a>
                <a href="articles/index.html" class="nav-link active">Articles</a>
            </div>
        </div>
    </nav>

    <main class="section">
        <article class="container" style="max-width: 800px;">
            <div class="badge mb-4">${category} / ${subCategory}</div>
            
            <h1 class="mb-4">${title}</h1>
            
            <div class="flex items-center gap-4 mb-4" style="color: var(--text-dim); font-size: 0.9rem;">
                <div class="flex items-center gap-2">
                    <i data-lucide="user" width="16"></i> ${author}
                </div>
                <div class="flex items-center gap-2">
                    <i data-lucide="calendar" width="16"></i> ${date}
                </div>
            </div>

            <div style="height: 1px; background: var(--border); margin: 2rem 0;"></div>

            <div class="content" style="font-size: 1.1rem; line-height: 1.8;">
                ${content}
            </div>
        </article>
    </main>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>`;

    downloadFile(filename, html);
    alert('Article generated successfully!');
}

// Generate Profile
function generateProfile(e) {
    e.preventDefault();
    const name = document.getElementById('prof-name').value;
    const initials = document.getElementById('prof-initials').value.toUpperCase();
    const role = document.getElementById('prof-role').value;
    const bio = document.getElementById('prof-bio').value;
    const github = document.getElementById('prof-github').value;

    // Create slug from name
    const filename = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Profile</title>
    <base href="../">
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/components.css">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <nav class="navbar">
        <div class="container nav-con">
            <a href="index.html" class="flex items-center gap-2" style="font-family: var(--font-logo); font-size: 1.25rem; color: #fff;">
                <img src="assets/images/logo.png" width="24" height="24" alt="C"> CODEER
            </a>
            <div class="nav-links">
                <a href="home.html" class="nav-link">Dashboard</a>
                <a href="guide/index.html" class="nav-link">Guide</a>
                <a href="articles/index.html" class="nav-link">Articles</a>
            </div>
        </div>
    </nav>
    <main class="section" style="padding-top: 6rem;">
        <div class="container" style="max-width: 800px; text-align: center;">
            <div style="width: 120px; height: 120px; background: #333; border-radius: 50%; margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; border: 1px solid var(--border);">
                ${initials}
            </div>
            <h1 class="mb-4">${name}</h1>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">${role}</p>
            <p style="color: var(--text-dim); margin-bottom: 2rem;">${bio}</p>
            
            <div class="flex justify-center gap-4 mb-4">
                ${github ? `<a href="https://github.com/${github}" class="btn btn-outline"><i data-lucide="github"></i> GitHub</a>` : ''}
            </div>
        </div>
    </main>
    <script>lucide.createIcons();</script>
</body>
</html>`;

    downloadFile(filename, html);
    alert('Profile generated! Save to profiles/ folder.');
}

// Generate Project
function generateProject(e) {
    e.preventDefault();
    const name = document.getElementById('proj-name').value;
    const desc = document.getElementById('proj-desc').value;
    const category = document.getElementById('proj-category').value;
    const repo = document.getElementById('proj-repo').value;
    const readme = document.getElementById('proj-readme').innerHTML;

    const filename = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Codeer</title>
    <base href="../">
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/components.css">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <nav class="navbar">
        <div class="container nav-con">
            <a href="index.html" class="flex items-center gap-2" style="font-family: var(--font-logo); font-size: 1.25rem; color: #fff;">
                <img src="assets/images/logo.png" width="24" height="24" alt="C"> CODEER
            </a>
            <div class="nav-links">
                <a href="home.html" class="nav-link">Dashboard</a>
                <a href="guide/index.html" class="nav-link">Guide</a>
                <a href="projects/index.html" class="nav-link active">Projects</a>
            </div>
        </div>
    </nav>
    <main class="section" style="padding-top: 6rem;">
        <div class="container" style="max-width: 900px;">
            <div class="flex items-center justify-between mb-4">
                <div>
                     <div class="badge mb-4">${category}</div>
                     <h1>${name}</h1>
                     <p class="mt-4">${desc}</p>
                </div>
                <div>
                    ${repo ? `<a href="${repo}" class="btn btn-primary"><i data-lucide="github"></i> View Source</a>` : ''}
                </div>
            </div>
            <div class="card mt-4">
                <h3>README.md</h3>
                <div class="mt-4" style="line-height: 1.8; color: var(--text-dim);">
                    ${readme}
                </div>
            </div>
        </div>
    </main>
    <script>lucide.createIcons();</script>
</body>
</html>`;

    downloadFile(filename, html);
    alert('Project page generated! Save to projects/ folder.');
}

