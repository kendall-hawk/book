// js/wordFrequency.js

const wordFrequencyPanel = document.getElementById("word-frequency-panel");
const wordFreqToggle = document.getElementById("word-freq-toggle");
const wordFreqContent = document.getElementById("word-freq-content");

// 存储全书词频，通过 localStorage 持久化
let globalWordFrequency = JSON.parse(localStorage.getItem('globalWordFrequency')) || {};

// 用于过滤常见词汇的停用词列表 (小写)
const stopWords = new Set([
    "the", "a", "an", "and", "is", "be", "to", "of", "in", "it", "that", "for", "on", "with",
    "as", "at", "by", "from", "are", "was", "were", "has", "have", "had", "will", "would",
    "can", "could", "should", "may", "might", "must", "do", "does", "did", "not", "but",
    "or", "so", "if", "then", "when", "where", "what", "who", "whom", "whose", "which",
    "how", "this", "that", "these", "those", "here", "there", "up", "down", "out", "in",
    "on", "at", "about", "above", "below", "before", "after", "between", "among", "through",
    "during", "into", "onto", "under", "over", "across", "along", "around", "behind", "below",
    "beneath", "beside", "besides", "between", "beyond", "concerning", "despite", "except",
    "for", "from", "inside", "like", "near", "off", "on", "at", "about", "outside", "over",
    "past", "regarding", "round", "since", "than", "through", "throughout", "till", "until",
    "unto", "up", "upon", "with", "within", "without", "i", "you", "he", "she", "it", "we",
    "they", "me", "him", "her", "us", "them", "my", "your", "his", "her", "its", "our",
    "their", "an", "to", "and", "or", "but", "if", "for", "with", "on", "at", "from", "by",
    "about", "as", "into", "like", "through", "after", "before", "over", "under", "up", "down",
    "out", "in", "of", "off", "all", "any", "some", "most", "many", "more", "much", "no", "such",
    "only", "own", "same", "so", "than", "too", "very", "would", "will", "just", "get", "go",
    "can", "could", "should", "may", "might", "must", "say", "see", "make", "take", "come",
    "know", "think", "look", "want", "give", "use", "find", "tell", "ask", "work", "seem",
    "feel", "try", "leave", "call", "would", "could", "should", "might", "much", "where",
    "which", "while", "who", "whom", "why", "how"
]);

// 确保词频面板的展开/折叠状态
export function setupWordFrequencyToggle() {
    wordFreqToggle.addEventListener("click", () => {
        wordFreqContent.classList.toggle("expanded");
        wordFreqContent.classList.toggle("collapsed");
        wordFreqToggle.querySelector('.toggle-icon').textContent = wordFreqContent.classList.contains("expanded") ? '-' : '+';
    });
    // 初始化显示状态
    wordFreqToggle.querySelector('.toggle-icon').textContent = wordFreqContent.classList.contains("expanded") ? '-' : '+';
}

// 更新并渲染词频
export function updateAndRenderWordFrequency(sentences) {
    // 累积当前章节的词频
    sentences.forEach(sentence => {
        sentence.words.forEach(wordObj => {
            const word = wordObj.text.toLowerCase().replace(/[^a-z0-9]/g, ''); // 仅保留字母数字，并转小写
            if (word && !stopWords.has(word)) { // 过滤空字符串和停用词
                globalWordFrequency[word] = (globalWordFrequency[word] || 0) + 1;
            }
        });
    });

    // 持久化到 localStorage
    localStorage.setItem('globalWordFrequency', JSON.stringify(globalWordFrequency));

    // 渲染词云
    renderWordCloud();
}

// 渲染词云
function renderWordCloud() {
    wordFreqContent.innerHTML = ""; // 清空旧词云

    const sortedWords = Object.entries(globalWordFrequency)
        .sort(([, freqA], [, freqB]) => freqB - freqA); // 按频率降序排列

    if (sortedWords.length === 0) {
        wordFreqContent.textContent = "Start reading to see word frequencies!";
        return;
    }

    const maxFreq = sortedWords[0][1];
    const minFreq = sortedWords[sortedWords.length - 1][1];
    const freqRange = maxFreq - minFreq;

    sortedWords.forEach(([word, freq]) => {
        const span = document.createElement("span");
        span.className = "word-cloud-item";
        span.textContent = word;

        // 对数缩放字体大小，防止大词过大，小词过小
        let fontSize = 1; // 最小字体倍数
        if (freqRange > 0) {
            // 将频率映射到1到4的范围 (或您想要的任何范围)
            // Math.log(freq) 可以使频率分布更平滑
            const normalizedFreq = (Math.log(freq) - Math.log(minFreq + 1)) / (Math.log(maxFreq + 1) - Math.log(minFreq + 1));
            fontSize = 1 + normalizedFreq * 2; // 字体大小从1倍到3倍
        } else if (freqRange === 0) { // 所有词频率一样
            fontSize = 1.5;
        }
        span.style.fontSize = `${fontSize}em`;

        wordFreqContent.appendChild(span);
    });
}

// 暴露获取词频数据的方法，如果其他模块需要
export function getWordFrequencyData() {
    return globalWordFrequency;
}

