module.exports = {
	env: {
		browser: true,
		node: true,
	},
	extends: ['next', 'airbnb', 'airbnb-typescript', 'plugin:import/recommended', 'plugin:import/typescript', 'prettier'],
	plugins: ['@typescript-eslint', 'import', 'require-explicit-generics', 'simple-import-sort'],
	settings: {
		next: {
			rootDir: ['apps/*/', 'packages/*/'],
		},
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
				project: ['apps/*/tsconfig.json'],
			},
		},
	},
	rules: {
		'react/function-component-definition': [
			2,
			{
				namedComponents: 'arrow-function',
			},
		],
		'react/prop-types': 'off',
		'no-console': 1,
		'import/no-named-as-default': 'off',
		'import/prefer-default-export': 'off',
		'@next/next/no-html-link-for-pages': 'off',
		'no-param-reassign': 'off',
		'react-hooks/exhaustive-deps': 'off',
		'spaced-comment': 'off',
		'jsx-a11y/anchor-is-valid': 'off',
		'import/no-extraneous-dependencies': [2, { devDependencies: true }],
		'react/jsx-props-no-spreading': 'off',
		'require-explicit-generics/require-explicit-generics': [2, ['React.useState', 'useState', 'useImmer']],
	},
	overrides: [
		{
			// 3) Now we enable eslint-plugin-testing-library rules or preset only for matching files!
			env: {
				jest: true,
			},
			files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
			extends: ['plugin:testing-library/react', 'plugin:jest/recommended'],
			rules: {
				'import/no-extraneous-dependencies': ['off', { devDependencies: ['**/?(*.)+(spec|test).[jt]s?(x)'] }],
				'jest/no-done-callback': 'off',
			},
		},
	],
	ignorePatterns: ['**/*.js', '**/*.json', 'node_modules', 'public', 'styles', '.next', 'coverage', 'dist', '.turbo'],
}
