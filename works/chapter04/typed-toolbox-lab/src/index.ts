type TaskStatus = "todo" | "doing" | "paused" | "done" | "blocked";
type DisplayValue = string | number | boolean | null;

type LearningTask = {
  title: string;
  estimatedMinutes: number;
  status: TaskStatus;
  notes?: string;
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

type TextNotice = {
  text: string;
};

type ErrorNotice = {
  error: string;
};

type WarningNotice = {
  warning: string;
};

type Notice = TextNotice | ErrorNotice | WarningNotice;

const task: LearningTask = {
  title: "Learn type narrowing",
  estimatedMinutes: 50,
  status: "blocked",
  notes: "Check before reading optional fields",
};

const result: SubmissionResult = {
  success: false,
  error: "Type narrowing question is not answered yet",
};

function formatDisplayValue(value: DisplayValue): string {
  if (value === null) {
    return "empty";
  }

  if (typeof value === "string") {
    return value.trim().toUpperCase();
  }

  if (typeof value === "number") {
    return `${value.toFixed(1)} minutes`;
  }

  return value ? "enabled" : "disabled";
}

function formatTaskNotes(task: LearningTask): string {
  if (task.notes) {
    return `Notes: ${task.notes}`;
  }

  return "Notes: none";
}

function formatSubmissionResult(result: SubmissionResult): string {
  if (result.success) {
    return `Success: ${result.message}`;
  }

  return `Failed: ${result.error}`;
}

function formatNotice(notice: Notice): string {
  if ("error" in notice) {
    return `Notice error: ${notice.error}`;
  }
  if ("warning" in notice) {
    return `Notice warning: ${notice.warning}`;
  }

  return `Notice text: ${notice.text}`;
}

function formatStatus(status: TaskStatus): string {
  switch (status) {
    case "todo":
      return "not started";
    case "doing":
      return "in progress";
    case "paused":
      return "paused";
    case "done":
      return "completed";
    case "blocked":
      return "blocked";
    default: {
      // never 只能被另一个 never 类型赋值
      // 如果新增状态没有被上面的 case 处理，这里会触发类型错误。
      const unreachable: never = status;
      return unreachable;
    }
  }
}

console.log(formatDisplayValue(task.title));
console.log(formatDisplayValue(task.estimatedMinutes));
console.log(formatTaskNotes(task));
console.log(formatSubmissionResult(result));
console.log(formatNotice({ text: "Use checks before reading branch fields" }));
console.log(formatStatus(task.status));
