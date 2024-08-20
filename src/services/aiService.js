import { exec } from 'child_process';
export function predictImage() {
    return new Promise((resolve, reject) => {
        exec('python3 src/model/predict.py', (error, stdout, stderr) => {
            if (error) {
                reject(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`stderr: ${stderr}`);
                return;
            }
            try {
                const result = JSON.parse(stdout);
                resolve(result);
            } catch (parseError) {
                reject(`JSON parse error: ${parseError.message}`);
            }

        });
    });
}

// 예시 사용법
// predictImage()
//     .then(result => {
//         console.log("Python script result:", result);
//     })
//     .catch(err => {
//         console.error("Python script error:", err);
//     });

