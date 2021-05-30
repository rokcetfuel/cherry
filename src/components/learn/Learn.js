import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import sortArrowSvg from '../../assets/img/sort-arrow.svg'
import { sortFlashcards } from '../../helpers'
import LearnProgress from './LearnProgress'
import LearnFinished from './LearnFinished'
import Button from '../visual/Button'

export default function Learn() {
  const setups = useSelector(state => state.data.setups)
  const flashcards = useSelector(state => state.data.flashcards)
  const currentSetup = useSelector(state => state.data.currentSetup)
  const pronunciation = setups.find(a => a.id === currentSetup).pronunciation

  /**
   * Sorting
   */
  const [sort, setSort] = useState('random')
  const [order, setOrder] = useState('asc')

  const sortOptions = {
    random: 'random',
    created: 'created',
    edited: 'edited',
    phrase: 'phrase',
    translation: 'translation'
  }

  if (pronunciation) {
    sortOptions.pronunciation = 'pronunciation'
  }

  const handleSort = (key) => {
    setOrder(order === 'asc'? 'desc': 'asc')
    setSort(key)
  }

  /**
   * Revealed
   */
  const [revealed, setRevealed] = useState('phrase')

  const revealedOptions = {
    phrase: 'phrase',
    translation: 'translation'
  }

  if (pronunciation) {
    revealedOptions.pronunciation = 'pronunciation'
  }

  const handleRevealed = (key) => {
    setRevealed(key)
  }

  /**
   * Tags
   */
  const [tags] = useState(
    flashcards && flashcards.length > 0 ? 
    [...new Set(flashcards.map(a => a.tags).flat().filter(Boolean))].sort() : 
    null 
  )

  const [selectedTags, setSelectedTags] = useState([])

  const handleTags = (tag) => {
    if (selectedTags) {
      if (selectedTags.includes(tag)) {
        setSelectedTags(selectedTags.filter((thisTag) => thisTag !== tag))
      } else {
        setSelectedTags([...selectedTags, tag])
      }
    } else {
      setSelectedTags([tag])
    }
  }

  /**
   * Progress
   */
  const [finished, setFinished] = useState(false)
  const [inProgress, setInProgress] = useState(false)
  const [progressFlashcards, setProgressFlashcards] = useState(false)
  const [progressCount, setProgressCount] = useState(flashcards.length)

  const handleBegin = () => {
    const sortedFlashcards = sortFlashcards(flashcards, sort, order)

    if (selectedTags && selectedTags.length > 0) {
      const filteredFlashcards = []

      sortedFlashcards.forEach(card => {
        if (card.tags && card.tags.length > 0) {
          if (selectedTags.some(tag => card.tags.includes(tag))) {
            filteredFlashcards.push(card)
          }
        }
      })

      setProgressCount(filteredFlashcards.length)
      setProgressFlashcards(filteredFlashcards)
    } else {
      setProgressCount(sortedFlashcards.length)
      setProgressFlashcards(sortedFlashcards)
    }

    setInProgress(true)
  }

  const handleStop = () => {
    setInProgress(false)
  }

  const handleFinish = () => {
    setFinished(true)
  }

  const handleAgain = () => {
    setFinished(false)
  }

  const handleDone = () => {
    setInProgress(false)
    setFinished(false)
  }

  /**
   * Return
   */
  return (
    <div className={`c-view c-learn ${!inProgress ? 'c-view--nav-first-white' : 'c-learn-progress'}`}>
      { inProgress ?
        <>
          { finished ? 
            <LearnFinished 
              count={progressCount} 
              again={handleAgain} 
              done={handleDone}
            />
          : 
            <LearnProgress 
              flashcards={progressFlashcards} 
              pronunciation={pronunciation}
              revealed={revealed} 
              finish={handleFinish} 
              stop={handleStop} 
            /> 
          }
        </>
      :
        <>
          <div className='c-header'>
            <div className='c-header-name'>
              learn
            </div>
            <div className='c-header-text'></div>
          </div>
          <div className='c-main'>

            <div className='c-section c-section-sort c-learn-sort'>
              <div className='c-section__header'>
                <div className='c-section__header-name'>
                  sort by
                </div>
              </div>
              <div className='c-section__content'>
                <div className='c-section__line'>
                  {Object.keys(sortOptions).map((key) => {
                    let sortClasses = `c-section-sort__option ${sort === key ? `c-section-sort__option--active c-section-sort__option--${order}` : ''}`

                    return (
                      <div key={key} onClick={() => handleSort(key)} className={sortClasses}>
                        <span className='c-section-sort__option-name'>
                          {sortOptions[key]}
                        </span>
                        { key !== 'random' &&
                          <span className='c-section-sort__option-arrow'>
                            <img src={sortArrowSvg} alt='' />
                          </span>
                        }
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className='c-section c-section-sort c-learn-reveal'>
              <div className='c-section__header'>
                <div className='c-section__header-name'>
                  revealed
                </div>
              </div>
              <div className='c-section__content'>
                <div className='c-section__line'>
                  {Object.keys(revealedOptions).map((key) => {
                    let revealedClasses = `c-section-sort__option ${revealed === key ? `c-section-sort__option--active` : ''}`

                    return (
                      <div key={key} onClick={() => handleRevealed(key)} className={revealedClasses}>
                        <span className='c-section-sort__option-name'>
                          {revealedOptions[key]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            { tags && tags.length > 0 &&
              <div className='c-section c-section-tags c-learn-tags'>
                <div className='c-section__header'>
                  <div className='c-section__header-name'>
                    tags
                  </div>
                </div>
                <div className='c-section__content'>
                  <div className='c-section__line'>
                    {tags.map((tag) => { 
                      let tagClass = `c-section-tags__item${selectedTags && selectedTags.includes(tag) ? ' c-section-tags__item--active' : ''}`
                      
                      return (
                        <div key={tag} onClick={() => handleTags(tag)} className={tagClass}>{tag}</div>
                      )
                    })}
                  </div>
                </div>
              </div>
            }
          </div>  
          <div className='c-nav'>
            <div className='c-nav-item'>
              <Link className='c-nav-item__link' to='/home'>
                <Button direction='left' />
              </Link>
            </div>
            <div className='c-nav-item'>
              <button className='c-nav-item__link' type='button'onClick={handleBegin}>
                <Button text='start' />
              </button>
            </div>
          </div>  
        </>
      }
    </div>
  )
}