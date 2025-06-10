// js/grammarHighlighter.js

import { positionPopup } from './definitions.js'; // 导入定位函数

const grammarTooltip = document.getElementById("grammar-tooltip");
const tooltipContent = grammarTooltip.querySelector(".tooltip-content");

// 语法角色及其简短定义
export const grammarRoleDefinitions = {
    "Subject": "主语：执行动作或被描述的对象。",
    "Verb": "谓语动词：描述主语的动作或状态。",
    "Object": "宾语：动作的承受者。",
    "Modifier": "修饰语：修饰其他词的词或短语。",
    "Determiner": "限定词：限定名词的词（如 'the', 'a'）。",
    "SubjectComplement": "主语补语：补充说明主语状态或特征的词。",
    "Conjunction": "连词：连接词、短语或句子的词。",
    "Preposition": "介词：表示时间、地点、方向等关系的词。",
    "Adjective": "形容词：修饰名词或代词。",
    "Adverb": "副词：修饰动词、形容词或其他副词。",
    "AuxiliaryVerb": "助动词：协助主动词构成时态、语态等的动词。",
    "ProperNoun": "专有名词：特定人、地点或事物的名称。",
    "Noun": "名词：表示人、地点、事物或概念的词。",
    "Pronoun": "代词：代替名词的词。",
    "Punctuation": "标点符号。",
    "Whitespace": "空白符。"
    // ... 可以根据需要添加更多
};

export function showGrammarTooltip(wordText, role, roleDefinition, targetElement) {
    // 确保弹窗在显示前是隐藏的
    hideGrammarTooltip();

    tooltipContent.innerHTML = `<strong>${role}</strong>: ${roleDefinition || "No definition available."}`;
    grammarTooltip.classList.add("show");
    positionPopup(grammarTooltip, targetElement, 'below'); // 定位到下方
}

export function hideGrammarTooltip() {
    grammarTooltip.classList.remove("show");
}

