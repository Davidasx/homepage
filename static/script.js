
async function loadConfig() {
    const response = await fetch('static/config.json');
    config = await response.json();
}

let news = {};

async function loadNews() {
    const response = await fetch('static/news.json');
    news = await response.json();
}

function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('zh') ? 'zh' : 'en';
}

let currentLang = localStorage.getItem('language') || detectBrowserLanguage();
let config;

function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('language', currentLang);
    updateContent();
}

function updateContent() {
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
    generateSites();
    const typingElement = document.getElementById('typing-text');
    if (config.i18n[currentLang]['intro']) {
        typeText(config.i18n[currentLang]['intro'], typingElement);
    }
}

function getStatusColor(type) {
    switch (type) {
        case 'launch':
        case 'fix':
            return '#28a745'; // normal
        case 'incident':
            return '#dc3545'; // incident
        case 'maintenance':
            return '#ffc107'; // maintenance
        case 'end':
            return '#6c757d'; // end
        default:
            return '#6c757d';
    }
}

function populateNewsModal() {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '';
    if (news.news_items) {
        const sortedNews = news.news_items.sort((a, b) => new Date(b.time) - new Date(a.time));

        sortedNews.forEach(item => {
            const newsItemDiv = document.createElement('div');
            newsItemDiv.className = 'news-item';

            const newsHeader = document.createElement('div');
            newsHeader.className = 'news-header';

            const indicator = document.createElement('div');
            indicator.className = 'news-type-indicator';
            indicator.style.backgroundColor = getStatusColor(item.type);
            newsHeader.appendChild(indicator);

            const title = document.createElement('span');
            title.className = 'news-title';
            title.textContent = item[`${currentLang}_title`];
            newsHeader.appendChild(title);

            const time = document.createElement('span');
            time.className = 'news-time';
            time.textContent = new Date(item.time).toLocaleString();
            newsHeader.appendChild(time);

            const description = document.createElement('p');
            description.className = 'news-description';
            description.textContent = item[`${currentLang}_desc`];

            newsItemDiv.appendChild(newsHeader);
            newsItemDiv.appendChild(description);
            newsList.appendChild(newsItemDiv);
        });
    }
}

function calculateServiceStatus() {
    const serviceStatus = {};
    if (news.news_items) {
        news.news_items.forEach(item => {
            let status;
            switch (item.type) {
                case 'launch':
                case 'fix':
                    status = 'normal';
                    break;
                case 'incident':
                    status = 'incident';
                    break;
                case 'maintenance':
                    status = 'maintenance';
                    break;
                case 'end':
                    status = 'end';
                    break;
                default:
                    status = 'normal';
            }
            item.affected_services.forEach(serviceName => {
                serviceStatus[serviceName] = status;
            });
        });
    }
    return serviceStatus;
}

function generateSites() {
    const sitesContainer = document.getElementById('sites-container');
    sitesContainer.innerHTML = '';
    const serviceStatus = calculateServiceStatus();

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

            const status = serviceStatus[site.en_name] || 'normal';
            const statusIndicator = document.createElement('div');
            statusIndicator.className = `status-indicator status-${status}`;
            statusIndicator.title = status.charAt(0).toUpperCase() + status.slice(1);
            navBox.appendChild(statusIndicator);

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
    await loadConfig();
    await loadNews();
    updateContent();

    const newsModal = document.getElementById('news-modal');
    const newsBtn = document.getElementById('newsBtn');
    const closeBtn = document.querySelector('.close-button');

    newsBtn.onclick = () => {
        populateNewsModal();
        newsModal.style.display = 'flex';
    };

    closeBtn.onclick = () => {
        newsModal.style.display = 'none';
    };

    window.onclick = event => {
        if (event.target == newsModal) {
            newsModal.style.display = 'none';
        }
    };
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

let typingTimer = null;

function typeText(text, element, speed = 100) {
    if (typingTimer) {
        clearTimeout(typingTimer);
    }

    let index = 0;
    element.textContent = '';
    if (!text) return;

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