// Dashboard Logic: Fetch Stats from GitHub API
const REPO_OWNER = 'siddu-k';
const REPO_NAME = 'codeer';
const BRANCH = 'main';

// Cache configuration (1 hour)
const CACHE_KEY = 'codeer_dashboard_data';
const CACHE_DURATION = 3600 * 1000;

document.addEventListener('DOMContentLoaded', initDashboard);

async function initDashboard() {
    // Check cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
            renderDashboard(data);
            return;
        }
    }

    // Fetch fresh data
    try {
        const data = await fetchRepoData();
        // Save to cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: data
        }));
        renderDashboard(data);
    } catch (err) {
        console.error('Failed to fetch GitHub data:', err);
        renderError();
    }
}

async function fetchRepoData() {
    // We want the full recursive tree to count all files
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${BRANCH}?recursive=1`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status}`);
    }

    const json = await response.json();
    return processTree(json.tree);
}

function processTree(tree) {
    let articleCount = 0;
    let projectCount = 0;
    const categories = new Set();
    const processedCats = [];

    tree.forEach(item => {
        // Count Articles: inside articles/content/..., ending in .html, not index.html
        if (item.path.startsWith('articles/content/') && item.path.endsWith('.html') && !item.path.endsWith('index.html')) {
            articleCount++;

            // Extract Category (e.g., articles/content/cloud/aws -> cloud)
            const parts = item.path.split('/');
            if (parts.length > 3) {
                const category = parts[2]; // 'cloud'
                categories.add(category);
            }
        }

        // Count Projects: inside projects/..., ending in .html, not index.html
        if (item.path.startsWith('projects/') && item.path.endsWith('.html') && !item.path.endsWith('index.html')) {
            projectCount++;
        }
    });

    // Format categories for rendering
    categories.forEach(cat => {
        processedCats.push({
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            slug: cat,
            count: tree.filter(i => i.path.startsWith(`articles/content/${cat}/`) && i.path.endsWith('.html')).length
        });
    });

    return {
        articles: articleCount,
        projects: projectCount,
        categories: processedCats
    };
}

function renderDashboard(data) {
    // Render Stats
    const articleEl = document.getElementById('stat-articles');
    const projectEl = document.getElementById('stat-projects');
    const catStatEl = document.getElementById('stat-categories'); // New element
    const catCountEl = document.getElementById('stat-cats-count');

    if (articleEl) animateValue(articleEl, 0, data.articles, 1000);
    if (projectEl) animateValue(projectEl, 0, data.projects, 1000);
    if (catStatEl) animateValue(catStatEl, 0, data.categories.length, 1000); // Animate categories count
    if (catCountEl) catCountEl.textContent = `${data.categories.length} Categories`;

    // Render Categories
    const grid = document.getElementById('category-grid');
    if (grid) {
        grid.innerHTML = '';

        if (data.categories.length === 0) {
            grid.innerHTML = '<div style="padding: 1rem; color: var(--text-dim); text-align: center;">No categories found yet.</div>';
            return;
        }

        data.categories.forEach(cat => {
            const card = document.createElement('a');
            card.href = `articles/index.html#${cat.slug}`; // Deep linking support
            card.className = 'trend-card';
            card.style.textDecoration = 'none';
            card.innerHTML = `
                <div style="width: 32px; height: 32px; background: var(--bg-card); border-radius: 6px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border);">
                    <i data-lucide="folder" width="16" style="color: var(--text-dim);"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 500; color: var(--text-main);">${cat.name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-dim);">Stats</div>
                </div>
                <div class="badge">${cat.count} files</div>
            `;
            grid.appendChild(card);
        });

        // Re-init icons for new content
        if (window.lucide) {
            lucide.createIcons();
        }
    }
}

function renderError() {
    const articleEl = document.getElementById('stat-articles');
    const projectEl = document.getElementById('stat-projects');
    const grid = document.getElementById('category-grid');

    if (articleEl) articleEl.textContent = '-';
    if (projectEl) projectEl.textContent = '-';
    if (grid) {
        grid.innerHTML = `
            <div style="padding: 1rem; color: #ef4444; text-align: center; font-size: 0.9rem;">
                <p>Failed to load data from GitHub.</p>
                <p style="font-size: 0.8rem; opacity: 0.8;">API rate limit may be exceeded.</p>
            </div>
        `;
    }
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
