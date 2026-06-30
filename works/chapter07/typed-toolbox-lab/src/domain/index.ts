export * from "./task.js";
export * from "./learner.js";
export * from "./collection.js";
export * from "./result.js";

import { Result } from "./result.js";
import { LearningTask } from "./task.js";

export function findTaskTitleResult(tasks: LearningTask[], title: string): Result<LearningTask, string> {
    const task = tasks.find((item) => item.title === title);

    if (task) {
      return { success : true, data: task };
    }

    return { success: false, error: `Task not found ${title}` };
}