import {
  countTaskByStatus,
  filterTasksByStatus,
  findTaskByTitle,
  getTaskTitles,
  getTotalEstimatedMinutes,
  filterLongTasks,
  findFirstBlockedTask,
  formatStatusCount,
  hasOpenTasks,
  type LearningTask,
} from "./domain/index.js";

const tasks: LearningTask[] = [
  {
    title: "Split code into modules",
    estimatedMinutes: 40,
    status: "done",
  },
  {
    title: "Practice array methods",
    estimatedMinutes: 50,
    status: "doing",
  },
  {
    title: "Reviewing type narrowing",
    estimatedMinutes: 30,
    status: "todo",
  },
];

const foundTask = findTaskByTitle(tasks, "Practice array methods");

console.log(`Titles: ${getTaskTitles(tasks).join(", ")}`);
console.log(`Doing count: ${filterTasksByStatus(tasks, "doing").length}`);
console.log(`Total minutes: ${getTotalEstimatedMinutes(tasks)}`);

if (foundTask) {
  console.log(`Found: ${foundTask.title}`);
}

console.log(`Done count: ${countTaskByStatus(tasks).done}`);

console.log(`Long tasks: ${filterLongTasks(tasks, 1).length}`);
console.log(`First blocked task: ${findFirstBlockedTask(tasks)}`);
console.log(`Format status count: ${formatStatusCount(countTaskByStatus(tasks))}`)

if (hasOpenTasks(tasks)) {
  console.log("Has open tasks.");
}
