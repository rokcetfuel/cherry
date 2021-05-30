import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateFilters } from '../../state/dataSlice.js'
import Button from '../visual/Button'
import Loading from '../visual/Loading'
import sortArrowSvg from '../../assets/img/sort-arrow.svg'

export default function Filter(props) {
  const { tags, pronunciaton, handleReturn } = props
  const dispatch = useDispatch()

  const setups = useSelector(state => state.data.setups)
  const loading = useSelector(state => state.data.status.loading)
  const currentSetup = useSelector(state => state.data.currentSetup)

  /**
   * Sorting
   */
  const [initialSort] = useState(setups.find(a => a.id === currentSetup).sort)
  const [sort, setSort] = useState(setups.find(a => a.id === currentSetup).sort)

  const sortOptions = {
    created: 'created',
    edited: 'edited',
    phrase: 'phrase',
    translation: 'translation'
  }

  if (pronunciaton) sortOptions.pronunciation = 'pronunciation'

  const handleSort = (key) => {
    setSort({
      order: sort.order === 'asc'? 'desc': 'asc',
      by: key
    })
  }

  /**
   * Tags
   */
  const initialTags = useSelector(state => state.data.tags)
  const [selectedTags, setSelectedTags] = useState(initialTags)

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
   * Submit
   */
  const handleSubmit = () => {
    const compSelectedTags = JSON.stringify(selectedTags ? [...selectedTags].sort() : [])
    const compInitialTags = JSON.stringify(initialTags ? [...initialTags].sort() : [])

    if (sort.by !== initialSort.by || sort.order !== initialSort.order || compSelectedTags !== compInitialTags) {
      dispatch(updateFilters({sort, selectedTags})).then((response) => {
        if (response.error) {
          console.log(response.error.message)
        } else {
          handleReturn()
        }
      })
    } else {
      handleReturn()
    }
  }

  return (
    <>
      <div className='c-modal c-view--nav-last-white c-filter'>
        <div className='c-header'>
          <div className='c-header-name'>
            sort & filter
          </div>
        </div>
        <div className='c-main'>
          <div className='c-section c-section-sort c-filter-sort'>
            <div className='c-section__header'>
              <div className='c-section__header-name'>
                sort by
              </div>
            </div>
            <div className='c-section__content'>
              <div className='c-section__line'>
                {Object.keys(sortOptions).map((key) => {
                  let sortClasses = `c-section-sort__option ${sort.by === key ? `c-section-sort__option--active c-section-sort__option--${sort.order}` : ''}`

                  return (
                    <div key={key} onClick={() => handleSort(key)} className={sortClasses}>
                      <span className='c-section-sort__option-name'>
                        {sortOptions[key]}
                      </span>
                      <span className='c-section-sort__option-arrow'>
                        <img src={sortArrowSvg} alt='' />
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          { tags && tags.length > 0 &&
            <div className='c-section c-section-tags c-filter-tags'>
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
            <button className='c-nav-item__link' onClick={handleReturn}>
              <Button direction='left' />
            </button>
          </div>
          <div className='c-nav-item'>
            <button className='c-nav-item__link' onClick={handleSubmit}>
              <Button text='apply' />
            </button>
          </div>
        </div>
      </div>

      { loading && <Loading /> }
    </>
  )
}