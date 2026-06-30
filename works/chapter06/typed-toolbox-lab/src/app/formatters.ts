import { formatStatus, isTaskDone, type LearningTask } from "../domain/task.js";

export function formatTaskSummary(task: LearningTask): string {
    return `${task.title} - ${formatStatus(task.status)} - ${task.estimatedMinutes} min`;
}

export function formatTaskNotes(task: LearningTask): string {
    if (task.notes) {
        return `Notes: ${task.notes}`;
    }

    return "Notes: none";
}

export function formatDoneLabel(task: LearningTask): string {
    return isTaskDone(task) ? "Done: yes" : "Done: no";
}