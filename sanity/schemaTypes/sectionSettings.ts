import {defineArrayMember, defineField, defineType} from 'sanity'
import {sections} from '../../app/lib/sections'

export const sectionSettings = defineType({
  name: 'sectionSettings',
  title: 'Ordine delle sezioni',
  type: 'document',
  initialValue: {order: sections.map(({value}) => ({_type: 'sectionOrderItem', _key: value, section: value}))},
  fields: [defineField({
    name: 'order',
    title: 'Sezioni',
    description: 'Trascina le sezioni per cambiare l’ordine dei filtri. Editoriali è in posizione provvisoria. Tutti resta sempre il primo filtro.',
    type: 'array',
    of: [defineArrayMember({
      name: 'sectionOrderItem', type: 'object', title: 'Sezione',
      fields: [defineField({
        name: 'section', title: 'Sezione', type: 'string',
        options: {list: sections.map(({value, label}) => ({value, title: label}))},
        validation: rule => rule.required(),
      })],
      preview: {
        select: {section: 'section'},
        prepare: ({section}) => ({title: sections.find(item => item.value === section)?.label ?? 'Sezione'}),
      },
    })],
    options: {sortable: true},
    validation: rule => rule.required().length(sections.length).custom(value => {
      if (!value) return true
      const keys = value.map(item => (item as {section?: string}).section)
      return new Set(keys).size === sections.length && keys.every(key => sections.some(section => section.value === key)) || 'Inserisci tutte le sezioni una sola volta.'
    }),
  })],
  preview: {prepare: () => ({title: 'Ordine delle sezioni'})},
})
