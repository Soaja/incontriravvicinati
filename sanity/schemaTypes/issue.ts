import {defineArrayMember, defineField, defineType} from 'sanity'

export const issue = defineType({
  name: 'issue',
  title: 'Numero',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'issueNumber',
      title: 'Numero',
      type: 'number',
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Copertina',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Testo alternativo', type: 'string'}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publicationDate',
      title: 'Data di pubblicazione',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', title: 'Descrizione', type: 'text', rows: 5}),
    defineField({
      name: 'pageCount',
      title: 'Numero di pagine',
      type: 'number',
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: 'pdfFile',
      title: 'File PDF',
      type: 'file',
      options: {accept: 'application/pdf'},
    }),
    defineField({
      name: 'featured',
      title: 'In evidenza',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'articles',
      title: 'Articoli',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'article'}]})],
      validation: (rule) => rule.unique(),
    }),
  ],
  orderings: [
    {
      title: 'Numero, dal più recente',
      name: 'issueNumberDesc',
      by: [{field: 'issueNumber', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', issueNumber: 'issueNumber', media: 'coverImage'},
    prepare({title, issueNumber, media}) {
      return {title, subtitle: issueNumber ? `Numero ${issueNumber}` : undefined, media}
    },
  },
})
