export type TaskStatus = "todo" | "doing" | "paused" | "blocked" | "done";

export type LearningTask = {
    title: string;
    estimatedMinutes: number;
    status: TaskStatus;
    notes?: string;
};

export type TaskStatusCount = Record<TaskStatus, number>;

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

export function getTaskTitles(tasks: LearningTask[]): string[] {
    return tasks.map((task) => task.title);
}

export function filterTasksByStatus(tasks: LearningTask[], status: TaskStatus): LearningTask[] {
    return tasks.filter((task) => task.status === status);
}

export function findTaskByTitle(tasks: LearningTask[], title: string): LearningTask | undefined {
    return tasks.find((task) => task.title === title);
}

export function getTotalEstimatedMinutes(tasks: LearningTask[]): number {
    return tasks.reduce((total, task) => total + task.estimatedMinutes, 0);
}

export function countTaskByStatus(tasks: LearningTask[]): TaskStatusCount {
    const counts: TaskStatusCount = {
        todo: 0,
        doing: 0,
        paused: 0,
        blocked: 0,
        done: 0,
    };

    for (const task of tasks) {
        counts[task.status] += 1;
    }

    return counts;
}

export function filterLongTasks(tasks: LearningTask[], minimumMinutes: number): LearningTask[] {
    return tasks.filter((task) => task.estimatedMinutes >= minimumMinutes);
}

export function findFirstBlockedTask(tasks: LearningTask[]): LearningTask | undefined {
    return tasks.find((task) => task.status === "blocked");
}

export function formatStatusCount(counts: TaskStatusCount): string {
    return `todo=${counts.todo}, doing = ${counts.doing}, paused = ${counts.paused}, blocked = ${counts.blocked}, done = ${counts.done}`;
}

export function hasOpenTasks(tasks: LearningTask[]): boolean {
    return tasks.some((task) => task.status != "done");
}
