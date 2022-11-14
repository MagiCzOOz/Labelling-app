export const endsWithAny = (suffixes: string[], str: string): boolean => {
    return suffixes.some((suffix: string) => str.toLowerCase().endsWith(suffix));
};

export const shuffleArray = (array: (string | number)[][]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const generateTimesArray = (duration: number) => {
    const times = [];
    for (let i = 0; i <= duration; i += parseInt(process.env.CLIPS_DURATION || '4')) {
        times.push(i);
    }
    return times;
};

export const camelCaseToClassicCase = (varName: string) => {
    return varName.replace(/([A-Z, 0-9])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
};
