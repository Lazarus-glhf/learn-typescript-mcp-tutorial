import { formatTaskNotes, formatTaskSummary, formatDoneLabel } from "./app/formatters.js";

import { type LearningTask, type LearnerProfile, formatLearner } from "./domain/index.js";

const task: LearningTask = {
  title: "Split code into modules",
  estimatedMinutes: 40,
  status: "doing",
  notes: "Move task types and formatters out of index.ts",
};

const learner: LearnerProfile = {
  name: `Lazarus`,
  currentChapter: 5,
};

console.log(formatTaskSummary(task));
console.log(formatTaskNotes(task));
console.log(formatDoneLabel(task));
console.log(formatLearner(learner));
