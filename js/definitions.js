// js/definitions.js

const definitionPopup = document.getElementById("definition-popup");
const popupContent = definitionPopup.querySelector(".popup-content");

export function showDefinitionPopup(wordText, role, defData, targetElement) {
    // 确保弹窗在显示前是隐藏的，避免跳动
    hideDefinitionPopup();

    popupContent.innerHTML = `
        <strong>${defData.title || wordText}</strong> <span class="word-pos">(${defData.pos || 'N/A'})</span><br>
        <span class="definition-text">${defData.definition || 'No definition available.'}</span>
        ${defData.imageSense ? `<div class="image-sense"><strong>Image:</strong> ${defData.imageSense}</div>` : ''}
        ${defData.example ? `<div class="example-sentence"><strong>Example:</strong> ${defData.example}</div>` : ''}
        <div class="grammar-role-info"><strong>Grammar Role:</strong> ${role}</div>
    `;
    definitionPopup.classList.add("show");
    positionPopup(definitionPopup, targetElement, 'above'); // 定位到上方
}

export function hideDefinitionPopup() {
    definitionPopup.classList.remove("show");
}

// Helper function to position popups
function positionPopup(popupElement, targetElement, position = 'above') {
    const rect = targetElement.getBoundingClientRect();
    const popupWidth = popupElement.offsetWidth;
    const popupHeight = popupElement.offsetHeight;

    let left = rect.left + window.scrollX + (rect.width / 2) - (popupWidth / 2);
    let top;

    if (position === 'above') {
        top = rect.top + window.scrollY - popupHeight - 10; // 10px 间距
    } else { // position === 'below' for grammar tooltip
        top = rect.bottom + window.scrollY + 10; // 10px 间距
    }

    // 屏幕边界检查
    if (left < window.scrollX) {
        left = window.scrollX + 5; // 距离左边5px
    }
    if (left + popupWidth > window.innerWidth + window.scrollX) {
        left = window.innerWidth + window.scrollX - popupWidth - 5; // 距离右边5px
    }
    if (top < window.scrollY && position === 'above') { // 如果上方空间不够，则显示在下方
        top = rect.bottom + window.scrollY + 10;
    } else if (top + popupHeight > window.innerHeight + window.scrollY && position === 'below') { // 如果下方空间不够，则显示在上方
        top = rect.top + window.scrollY - popupHeight - 10;
    }

    popupElement.style.left = `${left}px`;
    popupElement.style.top = `${top}px`;
}

// 导出 positionPopup 以便 grammarHighlighter 使用
export { positionPopup };

