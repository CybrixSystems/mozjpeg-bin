import process from 'node:process';
import {fileURLToPath} from 'node:url';
import binBuild from 'bin-build';
import bin from './index.js';

bin.run(['-version']).then(() => {
	console.log('mozjpeg pre-build test passed successfully');
}).catch(async error => {
	console.warn(error.message);
	console.warn('mozjpeg pre-build test failed');
	console.info('compiling from source');

	const config = [];

		if (process.platform === 'win32') {
		await execa.command('git clone https://github.com/microsoft/vcpkg.git');
		// Build vcpkg
		await execa.command('.\\vcpkg\\bootstrap-vcpkg.bat');
		// Install libpng and zlib
		await execa.command('.\\vcpkg\\vcpkg install libpng zlib');

		// Add vcpkg toolchain file to the configuration
		config.push('-DCMAKE_TOOLCHAIN_FILE=./vcpkg/scripts/buildsystems/vcpkg.cmake');
	}

	if (process.platform === 'darwin') {
		config.push('-DCMAKE_FIND_FRAMEWORK=LAST -DBUILD_SHARED_LIBS=OFF');
	}

	const cfg = [
		`cmake  ${config.join(' ')} .`,
	].join(' ');

	try {
		const source = fileURLToPath(new URL('../vendor/source/mozjpeg.tar.gz', import.meta.url));
		await binBuild.file(source, [
			cfg,
			'cmake --build . ',
		if (process.platform === 'win32') {
			`cp cjpeg-static.exe ${bin.dest()}/cjpeg.exe`,
		}
		else {
			`cp cjpeg-static ${bin.dest()}/cjpeg`,
		}
		]);

		console.log('mozjpeg built successfully');
	} catch (error) {
		console.error(error.stack);

		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1);
	}
});
