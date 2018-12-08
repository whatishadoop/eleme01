module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module'
	},
	// https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
	extends: 'standard', // eslint标准规则
	// required to lint *.vue files
	plugins: [
		'html'
	],
	// add your custom rules here  自定义扩展规则
	'rules': {
		// allow paren-less arrow functions
		'arrow-parens': 0, // 0表示关闭该规则
		// allow async-await
		'generator-star-spacing': 0,
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,// 开发环境可以debug,否则不可以
		'semi': ['error', 'always'],  // es6必须加分号
		'indent': 0,   // 缩进规则忽略
		'space-before-function-paren': 0
	}
}
