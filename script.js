document.addEventListener("DOMContentLoaded", async () => {
  const sentenceRes = await fetch("sentence.json");
  const definitionRes = await fetch("definitions.json");

  const sentenceData = await sentenceRes.json();
  const definitionData = await definitionRes.json();

  const container = document.getElementById("sentence");
  const tooltip = document.getElementById("tooltip");

  const roleColors = {
    Subject: "#ffcccc",
    Verb: "#ccffcc",
    Object: "#ccccff",
    Modifier: "#fff2cc",
    Determiner: "#e0e0e0",
    SubjectComplement: "#d1c4e9",
    Conjunction: "#ffe0b2",
    Preposition: "#b2ebf2",
    RelativePronoun: "#f8bbd0",
    Punctuation: "#eeeeee"
  };

  sentenceData.sentences.forEach((sentenceObj, sIndex) => {
    const sentenceDiv = document.createElement("div");
    sentenceDiv.className = "sentence-block";

    sentenceObj.words.forEach((wordObj, index) => {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = wordObj.text + " ";
      const color = roleColors[wordObj.role] || "#f0f0f0";
      span.style.borderBottom = `2px dotted ${color}`;
      span.dataset.index = index;
      span.dataset.sentence = sIndex;

      // tooltip events
      span.addEventListener("mouseenter", () => {
        const defKey = wordObj.definitionKey;
        if (defKey && definitionData[defKey]) {
          const def = definitionData[defKey];
          tooltip.innerHTML = `
            <strong>${wordObj.text}</strong> (${def.pos})<br>
            <em>${def.definition}</em><br>
            <small><strong>Image:</strong> ${def.imageSense}</small><br>
            <small><strong>Example:</strong> ${def.example}</small>
          `;
          tooltip.style.display = "block";
        } else {
          tooltip.style.display = "none";
        }
      });

      span.addEventListener("mousemove", (e) => {
        tooltip.style.top = e.pageY + 10 + "px";
        tooltip.style.left = e.pageX + 10 + "px";
      });

      span.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
      });

      sentenceDiv.appendChild(span);
    });

    container.appendChild(sentenceDiv);
  });
});