// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu(
    {
      stylistic: {
        indent: 2,
        quotes: 'single',
      },
    },
    {
      rules: {
        'vue/no-multiple-template-root': 'off',
        'style/brace-style': ['error', '1tbs'],
        'curly': ['error', 'all'],
        'vue/singleline-html-element-content-newline': ['error', {
          ignores: ['NuxtLink'],
        }],
        'unused-imports/no-unused-vars': ['error', {
          caughtErrorsIgnorePattern: '^_',
        }],
      },
    },
  ),
)
