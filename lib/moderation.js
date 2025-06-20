const bannedKeywords = ['\u66b4\u529b', '\u8fdd\u6cd5', 'badword'];

export function hasProhibitedKeywords(text) {
  if (!text) return false;
  return bannedKeywords.some(w => text.includes(w));
}
