type TaskStatus = "todo" | "doing" | "paused" | "done";

type TaskPriority = "low" | "medium" | "high";

type TaskSource = "manual" | "agent" | "imported";

type LearningTask = {
  title: string;
  estimatedMinutes: number;
  status: TaskStatus;
  priority: TaskPriority;
  source: TaskSource;
  notes?: string;
};

type LearnerProfile = {
  name: string;
  currentChapter: number;
};

type SubmissionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: string;
    };

const learner: LearnerProfile = {
  name: "Lazarus",
  currentChapter: 3,
};

const task : LearningTask = {
  title: "Learn union types",
  estimatedMinutes: 45,
  status: "doing",
  priority: "high",
  source: "agent",
  notes: "Replace boolean status with explicit states",
};

const submission: SubmissionResult = {
  success: true,
  // error: "should not be here",
  message: "Chapter 03 draft is ready for review",
};

const failSubmission: SubmissionResult = {
  success: false,
  error: "Missing required task status",
}

function formatStatus(status: TaskStatus): string {
  if (status == "todo") {
    return "not started";
  }

  if (status == "doing") {
    return "in progress";
  }

  if (status == "paused")
  {
    return "paused";
  }

  return "completed";
}

function formatPriority(priority: TaskPriority): string {
  if (priority == "high") {
    return `priority: high`;
  }
  if (priority == "medium") {
    return `priority: medium`;
  }

  return `priority: low`;
}

function formatTaskSummary(task: LearningTask): string {
  return `${task.title} - ${formatStatus(task.status)} - ${formatPriority(task.priority)} - Source: ${task.source} - ${task.estimatedMinutes} min`;
}

function formatSubmissionResult(result: SubmissionResult): string {
  if (result.success) {
    return `Success: ${result.message}`;
  }

  return `Failed: ${result.error}`;
}

console.log(`${learner.name} is studying chapter ${learner.currentChapter}`);
console.log(formatTaskSummary(task));
console.log(formatSubmissionResult(submission));
console.log(formatSubmissionResult(failSubmission));
