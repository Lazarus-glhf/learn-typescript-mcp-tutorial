interface LearningTask {
    title: string;
    estimatedMinutes: number;
    isCompleted: boolean;
    notes?: string;
    owner: {
        name: string;
        role: string;
    };
}

type LearnerProfile = {
    name: string;
    nickname?: string;
    currentChapter: number;
    preferences: {
        studyMinutesPerDay: number;
        wantsAgentFeedback: boolean;
    };
};

type StudyPlan = {
    learner: LearnerProfile;
    task: LearningTask;
    createdByAgent: boolean;
};

const learner: LearnerProfile = {
    name: "Lazarus",
    nickname: "lzr",
    currentChapter: 2,
    preferences: {
        studyMinutesPerDay: 60,
        wantsAgentFeedback: true,
    },
};

const task: LearningTask = {
    title: "Learn object types",
    estimatedMinutes: 60,
    isCompleted: false,
    notes: "Group related values into one model",
    owner: {
        name: "Lazarus",
        role: "learner",
    },
};

const studyPlan: StudyPlan = {
    learner: learner,
    task: task,
    createdByAgent: true,
};

function formatLearnerProfile(profile: LearnerProfile): string
{
    const nickNameStr = profile.nickname ? ` (${profile.nickname})` : ""
    return `${profile.name}${nickNameStr} is studying chapter ${profile.currentChapter}`;
}

function formatTaskSummary(task: LearningTask): string
{
    const statusText = task.isCompleted ? "completed" : "in progress";
    return `${task.title} - ${task.estimatedMinutes} min - ${statusText} - Owner: ${task.owner.name} (${task.owner.role})`;
}

function formatStudyPlan(plan: StudyPlan): string 
{
    return `${plan.learner.name} will work on: ${plan.task.title}`;
}

console.log(formatLearnerProfile(learner));
console.log(formatTaskSummary(task));
console.log(`Daily study target: ${learner.preferences.studyMinutesPerDay} minutes`);
console.log(`Study plan info: ${formatStudyPlan(studyPlan)}`);