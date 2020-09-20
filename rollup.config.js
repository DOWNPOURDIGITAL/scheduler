import typescript from 'rollup-plugin-typescript2';
import propertiesRenameTransformer from 'ts-transformer-properties-rename';
import { terser } from 'rollup-plugin-terser';


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
		terser({
			format: {
				comments: false,
			},
			mangle: {
				properties: {
					regex: /^_private_/,
				},
			},
		}),
		typescript({
			transformers: [( service ) => ({
				before: [
					propertiesRenameTransformer(
						service.getProgram(),
						{
							privatePrefix: '_private_',
							internalPrefix: '',
							entrySourceFiles: ['./src/scheduler.ts'],
						},
					),
				],
				after: [],
			})],
		}),
	],
};
