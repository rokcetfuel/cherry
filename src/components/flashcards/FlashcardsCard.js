import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../visual/Button'

export default function FlashcardsCard(props) {
  const { flashcard, pronunciation } = props

  return (
    <Link className='c-card' to={`/flashcard/${flashcard.id}`}>
      <div className='c-card__content'>
        <div className='c-card__top'>
          <div className='c-card__phrase'>
            {flashcard.phrase}
          </div>
          { pronunciation && 
            <div className='c-card__pronunciation'>
              {flashcard.pronunciation}
            </div>
          }
        </div>
        <div className='c-card__bottom'>
          <div className='c-card__translation'>
            {flashcard.translation}
          </div>
        </div>
      </div>
      <div className='c-card__side'>
        <div className='c-card__btn'>
          <Button direction='right' />
        </div>
      </div>
    </Link>
  )
}