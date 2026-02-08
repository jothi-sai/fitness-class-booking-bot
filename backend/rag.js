import fs from "fs";

const knowledge = fs.readFileSync("./data/knowledge.txt", "utf8");

export function retrieveContext(query) {
  const lines = knowledge.split("\n");

  let bestLine = lines[0];
  let maxScore = 0;

  for (let line of lines) {
    let score = 0;
    const words = query.toLowerCase().split(" ");
    for (let w of words) {
      if (line.toLowerCase().includes(w)) score++;
    }
    if (score > maxScore) {
      maxScore = score;
      bestLine = line;
    }
  }

  return bestLine;
}
