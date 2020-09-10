import typescript from 'rollup-plugin-typescript2';

export default {
	input: './src/scheduler.ts',

	output: [
		{
			file: 'dist/esm/scheduler.js',
			format: 'esm',
		},
		{
			file: 'dist/cjs/scheduler.js',
			format: 'cjs',
		},
	],

	plugins: [
		typescript(),
	],
};
