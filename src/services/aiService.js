import { exec } from 'child_process';
import path from 'path';

// 이미지 경로를 인자로 받아서 예측을 수행하는 함수
export function predictImage(imagePath) {
    return new Promise((resolve, reject) => {
        // 절대 경로를 사용하기 위해 path.resolve 사용
        const resolvedImagePath = path.resolve(imagePath);

        // exec 명령어에 imagePath를 인자로 추가
        exec(`python3 src/ai-model/predict.py "${resolvedImagePath}"`, (error, stdout, stderr) => {
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
