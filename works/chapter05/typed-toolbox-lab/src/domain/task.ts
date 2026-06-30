export type TaskStatus = "todo" | "doing" | "paused" | "blocked" | "done";

export type LearningTask = {
    title: string;
    estimatedMinutes: number;
    status: TaskStatus;
    notes?: string;
};

export function formatStatus(status: TaskStatus): string {
    switch (status) {
        case "todo":
            return "not started";
        case "doing":
            return "in progress";
        case "paused":
            return "paused";
        case "blocked":
            return "blocked";
        case "done":
            return "completed";
        default: {
            const unreachable: never = status;
            return unreachable;
        }
    }
}

export function isTaskDone(task: LearningTask): boolean {
    return task.status == "done";
}
