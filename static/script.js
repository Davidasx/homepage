
async function fetchConfig() {
    try {
        const response = await fetch('static/config.js');
        const text = await response.text();
        // Assuming config.js contains a variable assignment like "const config = {...};"
        // We can evaluate it to get the object.
        // A safer approach would be to have config.js be a pure JSON file.
        // For now, let's stick to the eval-like approach but with a function constructor
        // to limit scope.
        const config = new Function(`${text}; return config;`)();
        return config;
    } catch (error) {
        console.error('Failed to load config:', error);
        // Return a default or empty config to prevent further errors
        return { i18n: {}, categories: [] };
    }
}

function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('zh') ? 'zh' : 'en';
}

let currentLang = localStorage.getItem('language') || detectBrowserLanguage();

function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('language', currentLang);
    updateContent(window.config);
}

function updateContent(config) {
    document.getElementById('langBtn').textContent = currentLang === 'zh' ? 'EN' : '中文';
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';

    document.title = config.i18n[currentLang]['homepage'];

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (config.i18n[currentLang][key]) {
            element.textContent = config.i18n[currentLang][key];
        }
    });
    generateSites(config);
    const typingElement = document.getElementById('typing-text');
    typeText(config.i18n[currentLang]['intro'], typingElement);
}

function generateSites(config) {
    const sitesContainer = document.getElementById('sites-container');
    sitesContainer.innerHTML = '';

    config.categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';

        const categoryTitle = document.createElement('h2');
        categoryTitle.innerHTML = `${category.icon} <span data-i18n="${category.name}">${config.i18n[currentLang][category.name]}</span>`;
        categoryDiv.appendChild(categoryTitle);

        const navContainer = document.createElement('div');
        navContainer.className = 'nav-container';

        category.sites.forEach(site => {
            const navBox = document.createElement('div');
            navBox.className = 'nav-box';

            const link = document.createElement('a');
            link.href = site.obfuscated ? atob(site.url) : site.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            const icon = document.createElement('img');
            icon.src = site.icon;
            icon.alt = site[`${currentLang}_name`];
            icon.className = 'link-icon';
            link.appendChild(icon);

            const nameSpan = document.createElement('span');
            nameSpan.textContent = site[`${currentLang}_name`];
            link.appendChild(nameSpan);

            const description = document.createElement('p');
            description.className = 'nav-description';
            description.textContent = site[`${currentLang}_desc`];

            navBox.appendChild(link);
            navBox.appendChild(description);
            navContainer.appendChild(navBox);
        });

        categoryDiv.appendChild(navContainer);
        sitesContainer.appendChild(categoryDiv);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    window.config = await fetchConfig();
    updateContent(window.config);
});

document.addEventListener('contextmenu', function (event) {
    let element = event.target;
    let isLink = false;

    while (element) {
        if (element.tagName === 'A') {
            isLink = true;
            break;
        }
        element = element.parentElement;
    }

    if (!isLink) {
        event.preventDefault();
    }
});

document.addEventListener('copy', event => event.preventDefault());
document.addEventListener('paste', event => event.preventDefault());
document.addEventListener('cut', event => event.preventDefault());
document.addEventListener('keydown', function (event) {
    if (event.keyCode === 123 ||
        (event.ctrlKey && event.shiftKey && event.keyCode === 73) ||
        (event.ctrlKey && event.keyCode === 85)) {
        event.preventDefault();
        return false;
    }
});

let typingTimer = null;

function typeText(text, element, speed = 100) {
    if (typingTimer) {
        clearTimeout(typingTimer);
    }

    let index = 0;
    element.textContent = '';

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            typingTimer = setTimeout(type, speed);
        }
    }
    type();
}
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
// 检测系统主题
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
// 优先使用本地存储的主题,如果没有则使用系统主题
const savedTheme = localStorage.getItem('theme') || systemTheme;

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        // 只有在用户没有手动设置主题时才跟随系统
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
    }
});

root.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});