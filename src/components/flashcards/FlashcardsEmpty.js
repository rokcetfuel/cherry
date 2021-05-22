import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../visual/Button'

export default function FlashcardsEmpty() {
  return (
    <div className='c-flashcards-empty-container'>
      <div className='c-flashcards-empty-message'>
        <div className='c-flashcards-empty-message__circle'>
          there aren’t any flashcards in this setup yet...
        </div>
      </div>
      <div className='c-flashcards-empty-create'>
        <div className='c-flashcards-empty-create__circle'>
          <Link to='/flashcards/new'>
            <Button text='create flashcard' />
          </Link>
        </div>
      </div>
    </div>
  )
}