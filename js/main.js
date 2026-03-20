import { initRouter, updateEditorPreview, insertTemplate, copyEditorCode, downloadMarkdown, goBackSafe } from './router.js';
import { initSearch, openSearch, closeSearch } from './search.js';
import { initGithubAuth, publishToGitHub, uploadImage } from './github.js';

function togglePublishPanel() {
    const panel = document.getElementById('publish-panel');
    if (panel) {
        panel.classList.toggle('hidden');
        panel.classList.toggle('flex');
        if (!panel.classList.contains('hidden')) {
            updateMetaFields(); // Обновляем поля при открытии
        }
    }
}

function updateMetaFields() {
    const type = document.getElementById('meta-type').value;
    
    // Скрываем все группы по умолчанию
    document.querySelectorAll('.meta-group').forEach(el => el.classList.add('hidden'));
    
    if (type === 'lesson') {
        document.getElementById('field-track').classList.remove('hidden');
        document.getElementById('field-module').classList.remove('hidden');
        document.getElementById('field-order').classList.remove('hidden');
        document.getElementById('label-title').innerText = "Название Урока";
    } else if (type === 'cheat') {
        document.getElementById('field-order').classList.remove('hidden');
        document.getElementById('label-title').innerText = "Название Шпаргалки";
    } else if (type === 'project') {
        document.getElementById('field-project-desc').classList.remove('hidden');
        document.getElementById('field-project-authors').classList.remove('hidden');
        document.getElementById('field-project-tags').classList.remove('hidden');
        document.getElementById('label-title').innerText = "Название Проекта";
    } else if (type === 'intro') {
        document.getElementById('field-track-id').classList.remove('hidden');
        document.getElementById('field-track-icon').classList.remove('hidden');
        document.getElementById('field-track-color').classList.remove('hidden');
        document.getElementById('label-title').innerText = "Отображаемое Имя Трека";
    }
    
    autoTransliterate(); // Обновляем авто-поля при смене типа
}

const cyrillicToLatinMap = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
    'з': 'zh', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'yu',
    'я': 'ya', 'ь': '', 'ъ': ''
};

function autoTransliterate() {
    const title = document.getElementById('meta-title').value.toLowerCase();
    const type = document.getElementById('meta-type').value;
    
    let result = '';
    for (let i = 0; i < title.length; i++) {
        const char = title[i];
        if (cyrillicToLatinMap[char] !== undefined) {
            result += cyrillicToLatinMap[char];
        } else if (/[a-z0-9]/.test(char)) {
            result += char;
        } else if (char === ' ' || char === '-') {
            result += '_';
        }
    }
    
    // Убираем двойные подчеркивания
    result = result.replace(/_+/g, '_').replace(/^_|_$/g, '');
    
    if (!result) result = 'new_article';

    if (type === 'intro') {
        document.getElementById('meta-track-id').value = result;
        document.getElementById('meta-filename').value = 'intro';
    } else {
        document.getElementById('meta-filename').value = result;
    }
}

// ЭКСПОРТИРУЕМ ФУНКЦИИ СРАЗУ (до инициализации), чтобы они были доступны в HTML
window.goBackSafe = goBackSafe;
window.openSearch = openSearch;
window.closeSearch = closeSearch;
window.updateEditorPreview = updateEditorPreview;
window.insertTemplate = insertTemplate;
window.copyEditorCode = copyEditorCode;
window.downloadMarkdown = downloadMarkdown;
window.togglePublishPanel = togglePublishPanel;
window.updateMetaFields = updateMetaFields;
window.autoTransliterate = autoTransliterate;
window.publishToGitHub = publishToGitHub;
window.uploadImage = uploadImage;

// Инициализация роутера и других глобальных слушателей
initRouter();
initSearch();
initGithubAuth();

// Слушатель секретного сочетания клавиш (Ctrl + Shift + E)
window.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyE") {
        e.preventDefault();
        window.location.hash = "editor";
    }
});

const mdInput = document.getElementById("markdown-input");
const mdPreview = document.getElementById("editor-preview");
const mdPlaceholder = document.getElementById("editor-placeholder");

if(mdInput && mdPreview) {
    mdInput.addEventListener("input", () => updateEditorPreview(mdInput, mdPreview, mdPlaceholder));
    
    // Синхронизация скролла
    mdInput.addEventListener("scroll", () => {
        const percentage = mdInput.scrollTop / (mdInput.scrollHeight - mdInput.clientHeight);
        mdPreview.scrollTop = percentage * (mdPreview.scrollHeight - mdPreview.clientHeight);
    });

    // Передаем эти элементы в функции для редактора
    window.insertTemplate = (type) => insertTemplate(mdInput, type);
    window.copyEditorCode = (event) => copyEditorCode(mdInput, event);
    window.downloadMarkdown = () => downloadMarkdown(mdInput);

    // Если мы на странице редактора, сразу обновляем превью
    if (window.location.hash === '#editor') {
        updateEditorPreview(mdInput, mdPreview, mdPlaceholder);
    }
}
