import * as path from 'path';
import Mocha from 'mocha';
import pkg from 'glob';
const { glob } = pkg;

export function run(): Promise<void> {
	const mocha = new Mocha({
		ui: 'tdd'
	});
 
	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
		glob('**/**.test.js', { cwd: testsRoot }, (err: any, files: any) => {
			if (err) {
				return e(err);
			}

			files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));

			try {
				mocha.run((failures: number) => {
					if (failures > 0) {
						e(new Error(`${failures} tests failed.`));
					} else {
						c();
					}
				});
			} catch (err) {
				console.error(err);
				e(err);
			}
		});
	});
}