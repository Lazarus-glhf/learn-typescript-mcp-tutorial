const taskTitle: string = "Learn TypeScript basics";
const estimatedMinutes: number = 45;    // 45 是数字
const isCompleted: boolean = false;
const learnerName = "Lazarus";

function formatTaskTitle(title: string): string
{
    return title.trim();
}

function getRemainingMinutes(estimatedMinutes: number, completed: boolean): number
{
    if (completed)
    {
        return 0;
    }

    return estimatedMinutes;
}

// practice 1
function formatOwner(name: string): string
{
    return `Owner: ${name.trim()}`;
}

// practice 2
function getEstimatedEndHour(startHour: number, durationHours: number): number
{
    return startHour + durationHours;
}

const formattedTitle = formatTaskTitle(taskTitle);
const remainingMinutes = getRemainingMinutes(estimatedMinutes, isCompleted);

// practice a1
function describeCompletion(completed: boolean): string
{
    if (completed)
    {
        return "Status: completed";
    }
    return "Status: in progress";
}

console.log(`Task: ${formattedTitle}`);
console.log(`Remaining minutes: ${remainingMinutes}`);
// practice 1
console.log(formatOwner(learnerName));
// practice 2
const endHour = getEstimatedEndHour(20, 2);
console.log(`Estimated end hour: ${endHour}`);
// practice a1
console.log(describeCompletion(isCompleted));
