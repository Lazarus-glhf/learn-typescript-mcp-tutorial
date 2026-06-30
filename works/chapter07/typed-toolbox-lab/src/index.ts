import {
  firstOrDefault,
  formatResult,
  getProperty,
  lastOrDefault,
  makeSuccess,
  makeFailure,
  pluck,
  findTaskTitleResult,
  type LearningTask,
  type Result,
} from "./domain/index.js";

const tasks: LearningTask[] = [
  {
    title: "Practice generics",
    estimatedMinutes: 45,
    status: "doing",
  },
  {
    title: "Review array helpers",
    estimatedMinutes: 30,
    status: "done",
  },
];

const firstTask = firstOrDefault(tasks);
const firstTitle = firstTask ? getProperty(firstTask, "title") : "No task";
// const missingTitle = firstTask ? getProperty(firstTask, "missing") : "No task";

// const badResult: Result<string, string> = {
//   success: true,
//   error: "Wrong field",
// };


const lookupResult: Result<string, string> = firstTask
  ? { success: true, data: firstTitle }
  : { success: false, error: "No tasks found" };

const successItem = makeSuccess(firstOrDefault(tasks));
const failItem = makeFailure("Fail Item");

console.log(`First title: ${firstTitle}`);
console.log(formatResult(lookupResult));
console.log(`First number: ${firstOrDefault([10, 20, 30])}`);

console.log(lastOrDefault(tasks)?.title);
console.log(lastOrDefault([10, 20, 30]));

if (successItem.success) {
  if (successItem.data) {
    console.log(`Success item title: ${successItem.data.title}`);
  }
}
if (!failItem.success) {
  console.log(`Fail item error: ${failItem.error}`);
}

const titles = pluck<LearningTask, "title">(tasks, "title");
console.log(`${titles.join(", ")}`)

const result = findTaskTitleResult(tasks, "Review array helpers");
if (result.success) {
  console.log(`${result.data.title}`);
}