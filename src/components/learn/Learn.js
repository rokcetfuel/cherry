import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../visual/Button'
import sortArrowSvg from '../../assets/img/sort-arrow.svg'

export default function Learn() {
  const [sort, setSort] = useState('random')
  const [order, setOrder] = useState('asc')
  const [revealed, setRevealed] = useState('phrase')

  const sortOptions = {
    random: 'random',
    created: 'created',
    edited: 'edited',
    phrase: 'phrase',
    translation: 'translation',
    pronunciation: 'pronunciation'
  }

  const revealedOptions = {
    phrase: 'phrase',
    translation: 'translation',
    pronunciation: 'pronunciation'
  }

  const handleSort = (key) => {
    setOrder(order === 'asc'? 'desc': 'asc')
    setSort(key)
  }

  const handleRevealed = (key) => {
    setRevealed(key)
  }

  useEffect(() => {
    console.log(sort, order, revealed)
  }, [sort, order, revealed])

  return (
    <div className="c-view c-view--nav-first-white c-learn">
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

      </div>  
      <div className='c-nav'>
        <div className='c-nav-item'>
          <Link className='c-nav-item__link' to='/home'>
            <Button direction='left' />
          </Link>
        </div>
        <div className='c-nav-item'>
          <button className='c-nav-item__link' type='button'>
            <Button text='start' />
          </button>
        </div>
      </div>  
    </div>
  )
}