import type {SchemaTypeDefinition} from 'sanity'

import {article} from './article'
import {author} from './author'
import {issue} from './issue'
import {siteSettings} from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [article, author, issue, siteSettings],
}
