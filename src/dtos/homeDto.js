export const solution = (survey, choices) => {
    const types = {'E': 0, 'I': 0, 'N': 0, 'S': 0, 'F': 0, 'T': 0, 'P': 0, 'J': 0};

    for (let i = 0; i < choices.length; i++) {
        if (choices[i] === 0) {
            types[survey[i][0]] += 1;
        } else if (choices[i] === 1) {
            types[survey[i][1]] += 1;
        }
    }

    const typeKeys = Object.keys(types);
    let answer = '';

    for (let i = 0; i < typeKeys.length; i += 2) {
        if (types[typeKeys[i]] > types[typeKeys[i + 1]]) {
            answer += typeKeys[i];
        } else if (types[typeKeys[i]] < types[typeKeys[i + 1]]) {
            answer += typeKeys[i + 1];
        } else {
            answer += typeKeys[i] < typeKeys[i + 1] ? typeKeys[i] : typeKeys[i + 1];
        }
    }

    return answer;
};
