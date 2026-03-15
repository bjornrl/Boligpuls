import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'

export default defineConfig({
  name: 'boligpuls',
  title: 'Boligpuls Trondheim',

  projectId: 'p7x7ccrx',
  dataset: 'production',
  basePath: '/studio',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
