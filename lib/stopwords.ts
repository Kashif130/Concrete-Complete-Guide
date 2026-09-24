// Filler words ignored when a query is a natural-language question rather than a few keywords.
// Shared by the docs search (lib/docSearch.ts) and the help-center bot's routing (lib/helpBot.ts).
export const STOP = new Set([
  // en
  "the", "and", "for", "how", "what", "why", "who", "does", "can", "you", "are", "with", "this", "that",
  "from", "have", "into", "about", "your", "when", "will", "not", "is", "do", "to", "of", "in", "on", "my",
  "me", "it", "a", "an", "i", "if", "long", "much", "many", "should", "would", "could", "there", "their", "get",
  // roman urdu / hindi-in-latin / pidgin / indonesian
  "kya", "hai", "hain", "kaise", "kaisay", "karte", "kar", "karen", "karein", "karna", "ka", "ki", "ke", "ko", "se",
  "mein", "main", "aur", "kitni", "kitna", "hoti", "hota", "wetin", "dey", "na", "apa", "itu", "yang", "dan",
  "bagaimana", "cara", "untuk", "apakah", "dari",
  // hindi (devanagari)
  "में", "है", "हैं", "क्या", "कैसे", "कितना", "कितनी", "कितने", "लगता", "लगती", "का", "की", "के", "को", "से", "और", "पर",
  "यह", "वह", "होता", "होती", "होते", "करें", "करना", "कर", "मैं", "मेरा", "मेरी", "क्यों", "कब", "कौन",
  // zh bigrams that are pure grammar/question words
  "什么", "怎么", "多少", "是否", "如何", "可以", "的是", "是什", "是多", "要多", "多久", "需要", "有哪", "哪些", "怎样", "为什", "能否", "是不",
]);
