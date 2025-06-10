Promise.all([
  fetch('sentence.json').then(res => res.json()),
  fetch('definitions.json').then(res => res.json())
]).then(([sentenceData, definitions]) => {
  const container = document.getElementById('sentence');
  const tooltip = document.getElementById('tooltip');

  sentenceData.wordIndexes.forEach(index => {
    const wordInfo = definitions[index.toString()];
    const structure = sentenceData.structure.find(item => item.index === index);
    const span = document.createElement('span');
    span.textContent = wordInfo.text + ' ';
    span.classList.add('word');
    if (structure) {
      span.classList.add(structure.role); // e.g. subject, verb
    }

    span.onclick = () => {
      tooltip.classList.remove('hidden');
      tooltip.innerHTML = `
        <strong>${wordInfo.text}</strong> (${wordInfo.pos})<br/>
        <em>Definition:</em> ${wordInfo.definition}<br/>
        <em>Image Sense:</em> ${wordInfo.imageSense}<br/>
        <em>Example:</em> ${wordInfo.example}
      `;
    };

    container.appendChild(span);
  });
});
