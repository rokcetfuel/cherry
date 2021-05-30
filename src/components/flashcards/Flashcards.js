import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import FlashcardsCard from './FlashcardsCard'
import FlashcardsEmpty from './FlashcardsEmpty'
import Filter from './Filter'
import Button from '../visual/Button'
import filterSvg from '../../assets/img/filter.svg'
import { updateTags } from '../../state/dataSlice.js'

export default function Flashcards() {
  const dispatch = useDispatch()

  const tags = useSelector(state => state.data.tags)
  const setups = useSelector(state => state.data.setups)
  const allFlashcards = useSelector(state => state.data.flashcards)
  const currentSetup = useSelector(state => state.data.currentSetup)
  const pronunciation = setups.find(a => a.id === currentSetup).pronunciation

  /**
   * Filter
   */
  const [flashcards, setFlashcards] = useState(allFlashcards)
  const [filter, setFilter] = useState(false)
  const [allTags] = useState(
    allFlashcards && allFlashcards.length > 0 ? 
    [...new Set(allFlashcards.map(a => a.tags).flat().filter(Boolean))].sort() : 
    null 
  )

  useEffect(() => {
    const filteredTags = (tags && allTags) ? tags.filter(value => allTags.includes(value)) : null

    if (tags && filteredTags && tags.length > filteredTags.length) {
      dispatch(updateTags(filteredTags))
    }

    if (filteredTags && filteredTags.length > 0 && allFlashcards && allFlashcards.length > 0) {
      const filteredFlashcards = []

      allFlashcards.forEach(card => {
        if (card.tags && card.tags.length > 0) {
          if (filteredTags.some(tag => card.tags.includes(tag))) {
            filteredFlashcards.push(card)
          }
        }
      })

      setFlashcards(filteredFlashcards)
    } else {
      setFlashcards(allFlashcards)
    }
  }, [dispatch, tags, allTags, allFlashcards])

  /**
   * Return
   */
  return (
    <>
      { filter && 
        <Filter 
          tags={allTags}
          pronunciaton={pronunciation} 
          handleReturn={() => setFilter(false)} 
        /> 
      }
      
      <div className={`c-view c-flashcards ${(allFlashcards && allFlashcards.length > 0) ? 'c-view--nav-last-white' : 'c-flashcards-empty'}`}>
        <div className='c-header'>
          <div className='c-header-name'>
            flashcards
          </div>
          { tags && tags.length > 0 &&
            <div className='c-header-text'>
              {[...tags].sort().map((tag) =>
                <span key={tag}>#{tag}</span>
              )}
            </div>
          }
        </div>
        <div className='c-main'>
          { allFlashcards && allFlashcards.length > 0 ?
            <>
              { flashcards && flashcards.length > 0 ?
                <div className='c-flashcards-list'>
                  {flashcards.map((flashcard) =>
                    <FlashcardsCard 
                      key={flashcard.id} 
                      flashcard={flashcard} 
                      pronunciation={pronunciation} 
                    />
                  )}
                </div>
              :
                <div>
                  change filters
                </div>
              }
            </>
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
          { allFlashcards && allFlashcards.length > 0 &&
            <>
              <div className='c-nav-item c-flashcards-filter-btn'>
                <button className='c-nav-item__link' onClick={() => setFilter(true)}>
                  <span className='c-btn'>
                    <img src={filterSvg} alt='' />
                  </span>
                </button>
              </div> 
              <div className='c-nav-item'>
                <Link to='/flashcards/new' className='c-nav-item__link'>
                  <Button text='create' />
                </Link>
              </div>
            </>
          }
        </div>
      </div>
    </>
  )
}