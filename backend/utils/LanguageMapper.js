// utils/LanguageMapper.js

const languageMap = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  "c++": "C++",
  c: "C",
  go: "Go",
  bash: "Bash",
};

function normalizeLanguage(lang) {
  return languageMap[lang.toLowerCase()] || null;
}

module.exports = { normalizeLanguage };
