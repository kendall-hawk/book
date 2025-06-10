// js/app.js

import { loadChaptersIndex, loadChapter, loadDefinitions } from './dataLoader.js';
import { renderChapterContent, updateChapterNav, renderMediaContent } from './ui.js';
import { showDefinitionPopup, hideDefinitionPopup } from './definitions.js';
import { showGrammarTooltip, hideGrammarTooltip, grammarRoleDefinitions } from './grammarHighlighter.js';
import { updateAndRenderWordFrequency, getWordFrequencyData, setupWordFrequencyToggle } from './wordFrequency.js';

// --- 全局状态管理 ---
let chaptersIndex = [];       // 存储所有章节的索引信息
let definitions = {};         // 存储所有单词释义
let currentChapterData = null; // 存储当前加载章节的详细数据
let currentChapterIndex = 0;  // 当前章节在 chaptersIndex 数组中的索引

// --- DOM 元素引用 ---
const articleContainer = document.getElementById("article-content");
const chapterTitleElement = document.getElementById("chapter-title");
const chapterIndicatorElement = document.getElementById("chapter-indicator");
const prevChapterBtn = document.getElementById("prev-chapter");
const nextChapterBtn = document.getElementById("next-chapter");
const backToTopBtn = document.getElementById("back-to-top");
const backToHomeBtn = document.getElementById("back-to-home");
const definitionPopup = document.getElementById("definition-popup");
const grammarTooltip = document.getElementById("grammar-tooltip");
const popupCloseBtn = definitionPopup.querySelector(".popup-close");

// --- 事件监听器 ---
document.addEventListener("DOMContentLoaded", initializeApp);
document.addEventListener("click", handleGlobalClick);
document.addEventListener("scroll", handleGlobalScroll);

// --- 应用初始化 ---
async function initializeApp() {
    console.log("Initializing app...");
    try {
        // 1. 加载章节索引和全书释义
        chaptersIndex = await loadChaptersIndex();
        definitions = await loadDefinitions();
        console.log("Chapters Index loaded:", chaptersIndex);
        console.log("Definitions loaded:", definitions);

        if (chaptersIndex.length === 0) {
            articleContainer.innerHTML = "<p>No chapters found. Please check data/chapters_index.json</p>";
            return;
        }

        // 2. 加载并渲染第一个章节
        await goToChapter(currentChapterIndex);

        // 3. 设置词频面板的折叠/展开功能
        setupWordFrequencyToggle();

        // 4. 设置导航按钮事件
        setupNavButtons();

    } catch (error) {
        console.error("Failed to initialize application:", error);
        articleContainer.innerHTML = "<p>Error loading application data. Please check console for details.</p>";
    }
}

// --- 导航功能 ---
async function goToChapter(index) {
    if (index < 0 || index >= chaptersIndex.length) {
        console.warn("Requested chapter index is out of bounds:", index);
        return;
    }

    currentChapterIndex = index;
    const chapterToLoad = chaptersIndex[currentChapterIndex];

    try {
        // 加载当前章节的详细内容
        currentChapterData = await loadChapter(chapterToLoad.filePath);
        console.log(`Loaded Chapter ${chapterToLoad.title}:`, currentChapterData);

        // 更新章节标题和指示器
        chapterTitleElement.textContent = currentChapterData.chapterTitle || chapterToLoad.title;
        chapterIndicatorElement.textContent = `Chapter ${currentChapterIndex + 1} of ${chaptersIndex.length}`;

        // 渲染章节内容到UI
        renderChapterContent(articleContainer, currentChapterData.sentences);

        // 渲染媒体内容（如果存在）
        currentChapterData.sentences.forEach(sentence => {
            if (sentence.media) {
                renderMediaContent(articleContainer, sentence.media, sentence.id);
            }
        });

        // 更新词频统计并渲染词云
        updateAndRenderWordFrequency(currentChapterData.sentences);

        // 更新导航按钮状态
        updateChapterNav(prevChapterBtn, nextChapterBtn, currentChapterIndex, chaptersIndex.length);

        // 每次加载新章节时，隐藏所有弹窗
        hideAllPopups();

    } catch (error) {
        console.error(`Error loading chapter ${chapterToLoad.title}:`, error);
        articleContainer.innerHTML = `<p>Error loading chapter content for "${chapterToLoad.title}".</p>`;
    }
}

function setupNavButtons() {
    prevChapterBtn.addEventListener("click", () => goToChapter(currentChapterIndex - 1));
    nextChapterBtn.addEventListener("click", () => goToChapter(currentChapterIndex + 1));

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    backToHomeBtn.addEventListener("click", () => {
        window.location.href = 'index.html'; // 或您设定的目录页面URL
    });

    // 弹窗关闭按钮
    popupCloseBtn.addEventListener("click", hideDefinitionPopup);
}

// --- 全局事件处理：用于自动关闭弹窗 ---
function hideAllPopups() {
    hideDefinitionPopup();
    hideGrammarTooltip();
}

function handleGlobalClick(event) {
    const target = event.target;

    // 检查是否点击了有释义的单词，如果是，则处理释义弹窗
    if (target.classList.contains("word-has-definition")) {
        const wordText = target.textContent.trim();
        const role = target.dataset.role;
        const definitionKey = target.dataset.definitionKey;
        // 先隐藏所有，再显示特定的
        hideAllPopups();
        if (definitionKey) { // 只有有 definitionKey 的才显示上方释义
            showDefinitionPopup(wordText, role, definitionKey, definitions[definitionKey], target);
        }
        // 对于所有可点击单词，都显示下方语法提示
        showGrammarTooltip(wordText, role, grammarRoleDefinitions[role], target);

    } else if (!definitionPopup.contains(target) && !grammarTooltip.contains(target) && 
               !target.classList.contains("word-token")) { // 点击了非弹窗、非单词区域
        hideAllPopups();
    }
}

function handleGlobalScroll() {
    // 滚动时隐藏所有弹窗
    hideAllPopups();
}

