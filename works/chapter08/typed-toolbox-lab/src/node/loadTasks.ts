import { readFile } from "node:fs/promises";
import {
  parseConfig,
  parseLearningTasks,
  type Config,
  type LearningTask,
} from "../domain/index.js";

export async function loadTasksFromJson(
  filePath: string,
): Promise<LearningTask[]> {
  const text = await readFile(filePath, "utf8");
  const parsed: unknown = JSON.parse(text);
  return parseLearningTasks(parsed);
}

export async function loadTasksSummary(filePath: string): Promise<string> {
  const tasks = await loadTasksFromJson(filePath);
  return `Loaded ${tasks.length} tasks from ${filePath}`;
}

export async function loadConfigFromJson(filePath: string): Promise<Config> {
  const text = await readFile(filePath, "utf-8");
  const parsed: unknown = JSON.parse(text);
  return parseConfig(parsed);
}
