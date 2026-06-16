const textInput = document.querySelector("#textInput");
const charCount = document.querySelector("#charCount");
const charNoSpaceCount = document.querySelector("#charNoSpaceCount");
const englishWordCount = document.querySelector("#englishWordCount");
const lineCount = document.querySelector("#lineCount");
const paragraphCount = document.querySelector("#paragraphCount");
const goalInput = document.querySelector("#goalInput");
const goalProgressLabel = document.querySelector("#goalProgressLabel");
const shortPostMeter = document.querySelector("#shortPostMeter");
const shortPostStatus = document.querySelector("#shortPostStatus");
const copyButton = document.querySelector("#copyButton");
const clearButton = document.querySelector("#clearButton");

const DEFAULT_CHARACTER_GOAL = 280;
const englishWordPattern = /[A-Za-z]+(?:['-][A-Za-z]+)*/g;

function countCharacters(text) {
  return Array.from(text).length;
}

function countCharactersWithoutSpaces(text) {
  return Array.from(text).filter((char) => !/\s/u.test(char)).length;
}

function countEnglishWords(text) {
  return text.match(englishWordPattern)?.length ?? 0;
}

function countLines(text) {
  return text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length;
}

function countParagraphs(text) {
  return text
    .trim()
    .split(/\n\s*\n/)
    .filter((paragraph) => paragraph.trim().length > 0).length;
}

function formatNumber(value) {
  return new Intl.NumberFormat("ja-JP").format(value);
}

function getCharacterGoal() {
  const value = Number.parseInt(goalInput.value, 10);
  return Number.isFinite(value) ? Math.max(1, value) : DEFAULT_CHARACTER_GOAL;
}

function normalizeGoalInput() {
  goalInput.value = String(getCharacterGoal());
  updateCounts();
}

function updateCounts() {
  const text = textInput.value;
  const characters = countCharacters(text);
  const characterGoal = getCharacterGoal();
  const shortPostPercent = Math.round((characters / characterGoal) * 100);
  const meterWidth = Math.min(shortPostPercent, 100);

  charCount.textContent = formatNumber(characters);
  charNoSpaceCount.textContent = formatNumber(countCharactersWithoutSpaces(text));
  englishWordCount.textContent = formatNumber(countEnglishWords(text));
  lineCount.textContent = formatNumber(countLines(text));
  paragraphCount.textContent = formatNumber(countParagraphs(text));
  goalProgressLabel.textContent = `${formatNumber(characters)} / ${formatNumber(characterGoal)}文字`;
  shortPostStatus.textContent = `${formatNumber(shortPostPercent)}%`;
  shortPostMeter.style.width = `${meterWidth}%`;
  shortPostMeter.classList.toggle("is-over", characters > characterGoal);
}

async function copyText() {
  if (!textInput.value) {
    textInput.focus();
    return;
  }

  await navigator.clipboard.writeText(textInput.value);
  const originalLabel = copyButton.textContent;
  copyButton.textContent = "コピー済み";
  window.setTimeout(() => {
    copyButton.textContent = originalLabel;
  }, 1200);
}

function clearText() {
  textInput.value = "";
  updateCounts();
  textInput.focus();
}

textInput.addEventListener("input", updateCounts);
goalInput.addEventListener("input", updateCounts);
goalInput.addEventListener("blur", normalizeGoalInput);
copyButton.addEventListener("click", () => {
  copyText().catch(() => {
    textInput.select();
    document.execCommand("copy");
  });
});
clearButton.addEventListener("click", clearText);

updateCounts();
