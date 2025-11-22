import { defineConfig } from 'orval'

export default defineConfig({
  mhApi: {
    input: './docs/openapi.json',
    output: {
      mode: 'tags-split',
      target: './src/services/api/generated',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/services/api/custom-instance.ts',
          name: 'customInstance',
        },
      },
      clean: true,
    },
  },
})
