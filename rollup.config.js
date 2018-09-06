import typescript from 'rollup-plugin-typescript';
import babel from 'rollup-plugin-babel';


export default {
	input: './src/index.ts',

	output: {
		file: 'dist/index.js',
		format: 'cjs'
	},

	plugins: [
		typescript({
			typescript: require('typescript')
		}),
		babel({
			babelrc: false,
			presets: [['env', { modules: false }]]
		}),
	],
}
