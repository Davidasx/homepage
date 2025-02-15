
const i18n = {
    'en': {
        'homepage': 'DavidX\'s Homepage',
        'tools': 'Tools',
        'ai-chat': 'Free AI Chat',
        'ai-chat-desc': 'Chat online with LLMs for free.',
        'pastebin': 'Online Pastebin',
        'pastebin-desc': 'Share and store text online.',
        'link': 'URL Shortener',
        'link-desc': 'Shorten URLs and share them easily.',
        'monitor': 'Website Monitor',
        'monitor-desc': 'Status monitor for my websites.',
        'ping': 'Ping Test',
        'ping-desc': 'Test your network latency.',
        'mirrors': 'Mirror Sites',
        'github-acc': 'GitHub File Acceleration',
        'github-acc-desc': 'Accelerates GitHub file downloading. For study purposes only.',
        'wikipedia': 'Wikipedia',
        'wikipedia-desc': 'Mirror site of Wikipedia. For study purposes only.',
        'claude-us': 'Claude-US 🇺🇸',
        'claude-desc': 'Use claude.ai without getting banned. For study purposes only.',
        'claude-pl': 'Claude-PL 🇵🇱',
        'web': 'Web Proxy',
        'web-desc': 'Web proxy that works for many websites. For study purposes only.',
        'personal': 'Personal',
        'blog': 'Blog (International)',
        'blog-desc': 'My personal blog, written in English.',
        'blog-zh': 'Blog (Chinese)',
        'blog-zh-desc': 'My personal blog, written in Chinese.',
        'contact': 'Contact',
        'email': 'Email',
        'email-desc': 'You can send me an email for contact.',
        'github': 'GitHub',
        'github-desc': 'My GitHub account with most of my projects in it.',
        'telegram': 'Telegram',
        'telegram-desc': 'You can contact me via Telegram as well.',
        'intro': 'Hello, I\'m DavidX, a personal developer who loves coding. Welcome to my homepage! You can check out the tools I\'ve made or visit my blog. Feel free to contact me anytime!'
    },
    'zh': {
        'homepage': 'DavidX的主页',
        'tools': '工具',
        'ai-chat': '免费AI聊天',
        'ai-chat-desc': '免费的AI聊天。',
        'pastebin': '在线剪贴板',
        'pastebin-desc': '在线分享和存储文本。',
        'link': '短链生成器',
        'link-desc': '缩短URL并轻松分享。',
        'monitor': '网站监控',
        'monitor-desc': '监控我网站的状态。',
        'ping': 'Ping测试工具',
        'ping-desc': '测试您的网络延迟。',
        "mirrors": '镜像网站',
        'github-acc': 'GitHub文件加速',
        'github-acc-desc': '加速GitHub文件下载，仅供学习目的。',
        'wikipedia': '维基百科',
        'wikipedia-desc': '维基百科镜像站，仅供学习目的。（懂得都懂）',
        'claude-us': 'Claude-US 🇺🇸',
        'claude-desc': '稳定使用claude.ai，避免封号，仅供学习目的。',
        'claude-pl': 'Claude-PL 🇵🇱',
        'web': '网页代理',
        'web-desc': '支持多网站的网页代理，仅供学习目的。',
        'personal': '个人',
        'blog': '博客（国际版）',
        'blog-desc': '英文版的个人博客。',
        'blog-zh': '博客（国内版）',
        'blog-zh-desc': '中文版的个人博客。',
        'contact': '联系',
        'email': '电子邮件',
        'email-desc': '您可以给我发电子邮件。',
        'github': 'GitHub',
        'github-desc': '我的GitHub账户，您可以看到我大部分的项目。',
        'telegram': 'Telegram',
        'telegram-desc': '您也可以通过TG私信我。',
        'intro': '您好，我是DavidX，一名热爱编程的个人开发者。欢迎来到我的主页！您可以查看我做的各种工具，或者访问我的博客。如果您感兴趣，可以随时联系我！'
    }
};

function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('zh') ? 'zh' : 'en';
}

let currentLang = localStorage.getItem('language') || detectBrowserLanguage();

function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('language', currentLang);
    updateContent();
}

function updateContent() {
    document.getElementById('langBtn').textContent = currentLang === 'zh' ? 'EN' : '中文';
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';

    document.title = i18n[currentLang]['homepage'];

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (i18n[currentLang][key]) {
            element.textContent = i18n[currentLang][key];
        }
    });

    const typingElement = document.getElementById('typing-text');
    typeText(i18n[currentLang]['intro'], typingElement);
}

document.addEventListener('DOMContentLoaded', updateContent);

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