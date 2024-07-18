const fs = require('fs')

const patternGroupDepenciesWithSlash = () => {
  const exclude = ['react', 'react-native']

  const dependencies = Object.keys(
    JSON.parse(fs.readFileSync('./package.json', 'utf8')).dependencies,
  )
  const mapDependencies = dependencies
    .reduce((result, dependency) => {
      if (exclude.includes(dependency) || dependency.indexOf('/') === -1) {
        return result
      }

      const [core] = dependency.split('/')
      return [...result, core]
    }, [])
    .join('|')

  return `+(${mapDependencies})?(*)/**`
}

const patternGroupDepenciesWithoutSlash = () => {
  const exclude = ['react', 'react-native']

  const dependencies = Object.keys(
    JSON.parse(fs.readFileSync('./package.json', 'utf8')).dependencies,
  )
  const mapDependencies = dependencies
    .reduce((result, dependency) => {
      if (exclude.includes(dependency) || dependency.indexOf('/') >= 0) {
        return result
      }

      const [core] = dependency.split('/')
      return [...result, core]
    }, [])
    .join('|')

  return `+(${mapDependencies})**`
}

module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  rules: {
    semi: ['off'],
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        allowSeparatedGroups: true,
      },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [
          ['external', 'builtin'],
          'internal',
          ['sibling', 'parent'],
          'index',
        ],
        pathGroups: [
          {
            pattern: '@(react|react-native)',
            group: 'external',
            position: 'before',
          },
          // TODO: Make this both groups together: patternGroupDepenciesWithoutSlash & patternGroupDepenciesWithSlash
          // https://github.com/isaacs/minimatch#matchbase
          // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
          {
            pattern: patternGroupDepenciesWithoutSlash(),
            group: 'external',
            position: 'before',
          },
          {
            pattern: patternGroupDepenciesWithSlash(),
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@habit-five*/**',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['internal', 'react'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    'import/ignore': ['react-native'],
    'import/internal-regex': '^@habit-five/',
  },
}
