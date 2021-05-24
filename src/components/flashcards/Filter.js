import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateFilters } from '../../state/dataSlice.js'
import Button from '../visual/Button'
import Loading from '../visual/Loading'
import sortArrowSvg from '../../assets/img/sort-arrow.svg'

export default function Filter(props) {
  const { handleReturn } = props
  const dispatch = useDispatch()

  const currentSetup = useSelector(state => state.data.currentSetup)
  const setups = useSelector(state => state.data.setups)
  const loading = useSelector(state => state.data.status.loading)

  /**
   * Sorting
   */
  const [initialSort] = useState(setups.find(a => a.id === currentSetup).sort)
  const [sort, setSort] = useState(setups.find(a => a.id === currentSetup).sort)

  const sortOptions = {
    created: 'Created',
    edited: 'Edited',
    phrase: 'Phrase',
    translation: 'Translation',
    pronunciation: 'Pronunciation'
  }

  const handleSort = (key) => {
    setSort({
      order: sort.order === 'asc'? 'desc': 'asc',
      by: key
    })
  }

  /**
   * Submit
   */
  const handleSubmit = () => {
    if (sort.by !== initialSort.by || sort.order !== initialSort.order) {
      dispatch(updateFilters({sort})).then((response) => {
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
          <div className='c-section c-filter-sort'>
            <div className='c-section__header'>
              <div className='c-section__header-name'>
                sort by
              </div>
            </div>
            <div className='c-section__content'>
              <div className='c-section__line c-filter-sort__content'>
                {Object.keys(sortOptions).map((key) => {
                  let sortClasses = `c-filter-sort__option ${sort.by === key ? `c-filter-sort__option--active c-filter-sort__option--${sort.order}` : ''}`

                  return (
                    <div key={key} onClick={() => handleSort(key)} className={sortClasses}>
                      <span className='c-filter-sort__option-name'>
                        {sortOptions[key]}
                      </span>
                      <span className='c-filter-sort__option-arrow'>
                        <img src={sortArrowSvg} alt='' />
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