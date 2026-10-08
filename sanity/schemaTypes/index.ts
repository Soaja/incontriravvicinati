import type {SchemaTypeDefinition} from 'sanity'

import {article} from './article'
import {author} from './author'
import {issue} from './issue'
import {siteSettings} from './siteSettings'
import {rubrica} from './rubrica'
import {sectionSettings} from './sectionSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [article, author, issue, siteSettings, rubrica, sectionSettings],
}
