import React, { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import Button from '../visual/Button'
import crossSvg from '../../assets/img/cross.svg'

export default function LearnProgress(props) {
  const { flashcards, revealed, pronunciation, stop, finish } = props

  /**
   * Progress
   */
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentFlashcard, setCurrentFlashcard] = useState(
    flashcards && flashcards.length > 0 ? flashcards[currentIndex] : null
  )

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;

      setVisible({
        phrase: revealed === 'phrase',
        pronunciaton: revealed === 'pronunciaton',
        translation: revealed === 'translation'
      })

      setCurrentIndex(newIndex)
      setCurrentFlashcard(flashcards[newIndex])
    }
  }

  const handleNext = () => {
    const newIndex = currentIndex + 1;

    setVisible({
      phrase: revealed === 'phrase',
      pronunciaton: revealed === 'pronunciaton',
      translation: revealed === 'translation'
    })

    if (newIndex !== flashcards.length) {
      setCurrentIndex(newIndex)
      setCurrentFlashcard(flashcards[newIndex])
    } else {
      finish()
    }
  }

  /**
   * Swipe
   */
  const handleSwipe = useSwipeable({
    onSwipedRight: (e) => handlePrev(),
    onSwipedLeft: (e) => handleNext()
  })

  /**
   * Visibility
   */
  const [visible, setVisible] = useState({
    phrase: revealed === 'phrase',
    pronunciaton: revealed === 'pronunciaton',
    translation: revealed === 'translation'
  })

  const handleReveal = (item) => {
    setVisible({...visible, [item]: true})
  }

  return (
    <>
      <div className='c-learn-exit'>
        <button className='c-btn' onClick={stop}>
          <img src={crossSvg} alt='' />
        </button>
      </div>

      <div className='c-main' {...handleSwipe}>
        <div className='c-learn-progress__top'>
          <div className='c-learn-progress__phrase'>
            { revealed === 'phrase' || visible.phrase ? 
              <div className='c-learn-progress__item-text'>
                {currentFlashcard.phrase}
              </div> 
            : 
              <button className='c-learn-progress__item-btn' onClick={() => handleReveal('phrase')}>
                show phrase
              </button> 
            }
          </div>
          { pronunciation && currentFlashcard.pronunciation && 
            <div className='c-learn-progress__pronunciation'>
              { revealed === 'pronunciation' || visible.pronunciation ? 
                <div className='c-learn-progress__item-text'>
                  {currentFlashcard.pronunciation}
                </div> 
              : 
                <button className='c-learn-progress__item-btn' onClick={() => handleReveal('pronunciation')}>
                  show pronunciation
                </button>  
              }
            </div>
          }
        </div>

        <div className='c-learn-progress__bottom'>
          <div className='c-learn-progress__translation'>
            { revealed === 'translation' || visible.translation ? 
              <div className='c-learn-progress__item-text'>
                {currentFlashcard.translation}
              </div> 
            : 
              <button className='c-learn-progress__item-btn' onClick={() => handleReveal('translation')}>
                show translation
              </button>  
            }
          </div>
        </div>
      </div>
    
      <div className='c-nav'>
        <div className='c-nav-item'>
          <button className='c-nav-item__link' type='button' onClick={handlePrev} disabled={currentIndex < 1}>
            <Button direction='left' />
          </button>
        </div>
        <div className='c-nav-item'>
          <button className='c-nav-item__link' type='button' onClick={handleNext}>
            <Button direction='right' />
          </button>
        </div>
      </div>  
    </>
  )
}