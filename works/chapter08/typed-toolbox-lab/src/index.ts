import {
  loadConfigFromJson,
  loadTasksFromJson,
  loadTasksSummary,
} from "./node/loadTasks.js";

const tasks = await loadTasksFromJson("data/tasks.json");

console.log(`Loaded tasks: ${tasks.length}`);

for (const task of tasks) {
  console.log(`${task.title}: ${task.status} (${task.estimatedMinutes} min)`);
}

const summary = await loadTasksSummary("data/tasks.json");
console.log(`${summary}`);

const config = await loadConfigFromJson("data/config.json");
console.log(`Loaded config: ${config.projectName} (${config.defaultTaskStatus})`);
