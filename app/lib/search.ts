import {sections} from './sections'
export function searchParameters(input: string) {
  const query = input.trim().replace(/\s+/g, ' ').slice(0, 120)
  const words = query.toLocaleLowerCase('it').match(/[\p{L}\p{N}]+/gu) ?? []
  const terms = words.map(word => `${word}*`)
  const sectionKeys = sections.filter(section => [section.label, section.singular].some(label =>
    label.toLocaleLowerCase('it').includes(query.toLocaleLowerCase('it')))).map(section => section.value)
  return {query, terms, sectionKeys, searchable: query.length >= 2 && terms.length > 0}
}
