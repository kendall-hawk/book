// js/ui.js

// 渲染章节内容 (句子和单词)
export function renderChapterContent(containerElement, sentences) {
    containerElement.innerHTML = ""; // 清空旧内容

    sentences.forEach(sentenceObj => {
        const sentenceDiv = document.createElement("div");
        sentenceDiv.className = "sentence-block";
        sentenceDiv.id = sentenceObj.id; // 为每个句子添加ID

        let currentSentenceText = sentenceObj.text;
        let lastIndex = 0;

        sentenceObj.words.forEach(wordObj => {
            const wordText = wordObj.text;
            const wordRole = wordObj.role;
            const definitionKey = wordObj.definitionKey;

            // 找到当前单词在原始句子文本中的起始位置
            const actualStartIndex = currentSentenceText.indexOf(wordText, lastIndex);

            if (actualStartIndex === -1) {
                console.warn(`UI: Word "${wordText}" not found after index ${lastIndex} in sentence: "${currentSentenceText}"`);
                // 无法找到单词，插入其文本并继续，避免中断渲染
                const fallbackSpan = document.createElement("span");
                fallbackSpan.textContent = wordText;
                fallbackSpan.classList.add("word-token", "role-Other"); // Fallback role
                sentenceDiv.appendChild(fallbackSpan);
                lastIndex += wordText.length; // Update lastIndex to avoid infinite loop if issue persists
                return;
            }

            // 插入单词前的所有非单词字符 (空格、标点等)
            if (actualStartIndex > lastIndex) {
                const nonWordText = currentSentenceText.substring(lastIndex, actualStartIndex);
                const nonWordSpan = document.createElement("span");
                nonWordSpan.textContent = nonWordText;
                nonWordSpan.classList.add('word-token', 'role-Whitespace'); // 给空格一个特殊类
                sentenceDiv.appendChild(nonWordSpan);
            }

            // 渲染单词本身
            const span = document.createElement("span");
            span.className = "word-token";
            span.textContent = wordText;
            
            // 添加语法角色类
            span.classList.add(`role-${wordRole}`);
            span.dataset.role = wordRole; // 存储到 dataset

            // 如果有释义，添加特殊类和 definitionKey
            if (definitionKey) {
                span.classList.add("word-has-definition");
                span.dataset.definitionKey = definitionKey;
            }

            sentenceDiv.appendChild(span);
            lastIndex = actualStartIndex + wordText.length;
        });

        // 插入句子末尾剩余的非单词字符
        if (lastIndex < currentSentenceText.length) {
            const trailingText = currentSentenceText.substring(lastIndex);
            const trailingSpan = document.createElement("span");
            trailingSpan.textContent = trailingText;
            trailingSpan.classList.add('word-token', 'role-Punctuation'); // 标点和末尾空格
            sentenceDiv.appendChild(trailingSpan);
        }

        containerElement.appendChild(sentenceDiv);
    });
}

// 渲染媒体内容
export function renderMediaContent(articleContainer, mediaObj, sentenceId) {
    const sentenceDiv = document.getElementById(sentenceId);
    if (!sentenceDiv) {
        console.warn(`UI: Sentence div with ID ${sentenceId} not found for media.`);
        return;
    }

    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'media-container';

    let mediaElement;
    if (mediaObj.type === 'audio') {
        mediaElement = document.createElement('audio');
        mediaElement.controls = true;
    } else if (mediaObj.type === 'video') {
        mediaElement = document.createElement('video');
        mediaElement.controls = true;
        mediaElement.autoplay = false; // 默认不自动播放
        mediaElement.loop = false; // 默认不循环
        mediaElement.preload = 'metadata'; // 预加载元数据
    } else {
        console.warn(`UI: Unsupported media type: ${mediaObj.type}`);
        return;
    }

    mediaElement.src = mediaObj.src;
    mediaContainer.appendChild(mediaElement);

    if (mediaObj.description) {
        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'media-description';
        descriptionDiv.textContent = mediaObj.description;
        mediaContainer.appendChild(descriptionDiv);
    }

    // 将媒体容器添加到句子 div 的后面
    sentenceDiv.after(mediaContainer);
}

// 更新章节导航按钮状态
export function updateChapterNav(prevBtn, nextBtn, currentIndex, totalChapters) {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalChapters - 1;
}

