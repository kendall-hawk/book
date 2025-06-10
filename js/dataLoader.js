// js/dataLoader.js

// 载入章节索引
export async function loadChaptersIndex() {
    const response = await fetch("data/chapters_index.json");
    if (!response.ok) {
        throw new Error(`Failed to load chapters_index.json: ${response.statusText}`);
    }
    return response.json();
}

// 载入单个章节内容
export async function loadChapter(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error(`Failed to load chapter from ${filePath}: ${response.statusText}`);
    }
    return response.json();
}

// 载入全书单词释义
export async function loadDefinitions() {
    const response = await fetch("data/definitions.json");
    if (!response.ok) {
        throw new Error(`Failed to load definitions.json: ${response.statusText}`);
    }
    return response.json();
}

