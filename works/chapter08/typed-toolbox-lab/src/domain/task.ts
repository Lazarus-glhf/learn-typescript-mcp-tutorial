export type TaskStatus = "todo" | "doing" | "paused" | "blocked" | "done";

export type LearningTask = {
  title: string;
  estimatedMinutes: number;
  status: TaskStatus;
  notes?: string;
};

export type Config = {
  projectName: string;
  defaultTaskStatus: TaskStatus;
};

export function isTaskStatus(value: unknown): value is TaskStatus {
  return (
    value === "todo" ||
    value === "doing" ||
    value === "paused" ||
    value === "blocked" ||
    value === "done"
  );
}

export function isLearningTask(value: unknown): value is LearningTask {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const task = value as Record<string, unknown>;

  return (
    typeof task.title === "string" &&
    typeof task.estimatedMinutes === "number" &&
    isTaskStatus(task.status) &&
    (task.notes === undefined || typeof task.notes === "string")
  );
}

export function isConfig(value: unknown): value is Config {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const config = value as Record<string, unknown>;
  return typeof config.projectName === "string" && isTaskStatus(config.defaultTaskStatus);
}

export function parseLearningTasks(value: unknown): LearningTask[] {
  if (!Array.isArray(value)) {
    throw new Error("Expected tasks JSON to be an array");
  }

  if (!value.every(isLearningTask)) {
    throw new Error("Expected every task to match LearningTask");
  }

  return value;
}

export function parseConfig(value: unknown): Config {
  if (!isConfig(value)) {
    throw new Error("Expected config JSON to match Config");
  }

  return value;
}
