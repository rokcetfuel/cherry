import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import FlashcardsCard from './FlashcardsCard'
import FlashcardsEmpty from './FlashcardsEmpty'
import Button from '../visual/Button'

export default function Flashcards() {
  const flashcards = useSelector(state => state.data.flashcards)
  const currentSetup = useSelector(state => state.data.currentSetup)
  const setups = useSelector(state => state.data.setups)
  const pronunciationActive = setups.find(a => a.id === currentSetup).pronunciation

  return (
    <div className={`c-view c-view--nav-last-white c-flashcards ${(!flashcards || flashcards.length === 0)? 'c-flashcards-empty': ''}`}>
      <div className='c-header'>
        <div className='c-header-name'>
          flashcards
        </div>
      </div>
      <div className='c-main'>
        { flashcards && flashcards.length > 0 ?
          <div className='c-flashcards-list'>
            {flashcards.map((flashcard) =>
              <FlashcardsCard 
                key={flashcard.id} 
                flashcard={flashcard} 
                pronunciation={pronunciationActive} 
              />
            )}
          </div>
        :
          <FlashcardsEmpty />
        }
      </div>
      <div className='c-nav'>
        <div className='c-nav-item'>
          <Link to='/' className='c-nav-item__link'>
            <Button direction='left' />
          </Link>
        </div>
        { flashcards ? 
          <div className='c-nav-item'>
            <Link to='/flashcards/new' className='c-nav-item__link'>
              <Button text='create' />
            </Link>
          </div>
        : '' }
      </div>
    </div>
  )
}