import { initRouter, updateEditorPreview, insertTemplate, copyEditorCode, downloadMarkdown, goBackSafe } from './router.js';
import { initSearch, openSearch, closeSearch } from './search.js';

// ЭКСПОРТИРУЕМ ФУНКЦИИ СРАЗУ (до инициализации), чтобы они были доступны в HTML
window.goBackSafe = goBackSafe;
window.openSearch = openSearch;
window.closeSearch = closeSearch;
window.updateEditorPreview = updateEditorPreview;
window.insertTemplate = insertTemplate;
window.copyEditorCode = copyEditorCode;
window.downloadMarkdown = downloadMarkdown;

// Инициализация роутера и других глобальных слушателей
initRouter();
initSearch();

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
    
    // Передаем эти элементы в функции для редактора
    window.insertTemplate = (type) => insertTemplate(mdInput, type);
    window.copyEditorCode = (event) => copyEditorCode(mdInput, event);
    window.downloadMarkdown = () => downloadMarkdown(mdInput);

    // Если мы на странице редактора, сразу обновляем превью
    if (window.location.hash === '#editor') {
        updateEditorPreview(mdInput, mdPreview, mdPlaceholder);
    }
}
