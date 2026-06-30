export type LearnerProfile = {
    name: string;
    currentChapter: number;
};

export function formatLearner(profile: LearnerProfile): string {
    return `${profile.name} is studying chapter ${profile.currentChapter}`;
}
