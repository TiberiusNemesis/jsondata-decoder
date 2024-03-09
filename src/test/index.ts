import * as path from 'path';
import * as Mocha from 'mocha';
import { promisify } from 'util';
import { glob } from 'glob';

const globPromise = promisify(glob);

export async function run(): Promise<void> {
    const mocha = new Mocha({
        ui: 'tdd',
        color: true
    });

    const testsRoot = path.resolve(__dirname, '.');

    try {
        const files: string[] = await globPromise('**/*.test.js', { cwd: testsRoot }) as string[];

        files.forEach(file => mocha.addFile(path.resolve(testsRoot, file)));

        return new Promise((resolve, reject) => {
            mocha.run(failures => {
                if (failures > 0) {
                    reject(new Error(`${failures} tests failed.`));
                } else {
                    resolve();
                }
            });
        });
    } catch (err) {
        console.error('Error finding test files:', err);
        throw err; 
    }
}

if (require.main === module) {
    run().catch(err => {
        console.error(err);
        process.exit(1);
    });
}
