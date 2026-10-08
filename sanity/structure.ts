import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Ordine delle sezioni').id('sectionSettings')
        .child(S.document().schemaType('sectionSettings').documentId('sectionSettings')),
      ...S.documentTypeListItems().filter(item => item.getId() !== 'sectionSettings'),
    ])
