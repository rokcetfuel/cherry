import { orderBy } from 'lodash-es'

export const dateRelativeTime = (d) => {
  const units = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: 24 * 60 * 60 * 1000 * 365/12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000
  }

  const date = new Date(d)
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  const getRelativeTime = (d1, d2 = new Date()) => {
    const elapsed = d1 - d2

    for (let u in units) {
      if (Math.abs(elapsed) > units[u] || u === 'second') { 
        return rtf.format(Math.round(elapsed/units[u]), u)
      }
    }
  }

  return getRelativeTime(date)
}

export const sortFlashcards = (flashcards, by, order) => {
  let newFlashcards = []

  if (flashcards && flashcards.length > 0) {
    newFlashcards = flashcards.map(a => Object.assign({}, a))

    if (by === 'edited') {
      newFlashcards = orderBy(flashcards, (o) => o.edited ? o.edited : o.created, order)
    } else if (by === 'pronunciation') {
      newFlashcards = orderBy(flashcards, (o) => o.pronunciation ? o.pronunciation : null, order)
      newFlashcards.sort((a, b) => (a===null)-(b===null) || +(a>b) || -(a<b))
    } else {
      newFlashcards = orderBy(flashcards, by, order)
    }
  }

  return newFlashcards
}