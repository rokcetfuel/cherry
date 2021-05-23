import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import containsChinese from 'contains-chinese'
import pinyin from 'chinese-to-pinyin'
import TextareaAutosize from 'react-textarea-autosize'

import { createFlashcard, cleanDataError } from '../../state/dataSlice.js'
import Button from '../visual/Button'
import Loading from '../visual/Loading'

export default function NewFlashcard() {
  const history = useHistory()
  const dispatch = useDispatch()

  /**
   * Flashcard
   */
  const [flashcard, setFlashcard] = useState({
    phrase: '',
    translation: '',
    pronunciation: ''
  })

  /**
   * Pronunciaton Active
   */
  const currentSetup = useSelector(state => state.data.currentSetup)
  const setups = useSelector(state => state.data.setups)
  const pronunciation = setups.find(a => a.id === currentSetup).pronunciation

  /**
   * Handle Submit
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(createFlashcard(flashcard)).then(({payload}) => {
      if (!payload.error) history.push('/flashcards')
    })
  }

  /**
   * Validation
   */
  const loading = useSelector(state => state.data.status.loading)
  const error = useSelector(state => state.data.status.error)
  const handleLeave = () => dispatch(cleanDataError())

  /**
   * Detect Chinese
   */
  const [chinese, setChinese] = useState(false)

  useEffect(() => {
    setChinese(containsChinese(flashcard.phrase))
  }, [flashcard.phrase])

  const generatePronunciation = () => {
    setFlashcard({...flashcard, pronunciation: pinyin(flashcard.phrase)})
    setChinese(false)
  }

  return (
    <>
      { loading && <Loading /> }
      <div className="c-view c-view--nav-last-white c-new-flashcard">
        <div className='c-header'>
          <div className='c-header-name'>
            create
          </div> 
        </div>
        <div className='c-main'>
          <div className='c-form'>
            <form id='form_create_flashcard' autoComplete='off' onSubmit={handleSubmit}>
              <div className='c-form__line'>
                <div className='c-form__field c-form__field--phrase'>
                  <TextareaAutosize 
                    onChange={e => setFlashcard({...flashcard, phrase: e.target.value})} 
                    value={flashcard.phrase} id='phrase' className='c-form__input' 
                    placeholder='phrase' spellCheck='false' maxLength='320' autoFocus
                  />
                  <label className='c-form__label' htmlFor='phrase'>phrase</label>
                </div>
              </div>


              { pronunciation &&
                <div className='c-form__line'>
                  <div className='c-form__field c-form__field--pronunciation'>
                    <TextareaAutosize 
                      onChange={e => setFlashcard({...flashcard, pronunciation: e.target.value})} 
                      value={flashcard.pronunciation} id='pronunciation' className='c-form__input' 
                      placeholder='pronunciation' spellCheck='false' maxLength='320'
                    />
                    <label className='c-form__label' htmlFor='pronunciation'>Pronunciation</label>
                  </div>
                  { chinese &&
                    <div className='c-form__feature' onClick={generatePronunciation}>
                      <Button text='auto?'/>
                    </div>
                  }
                </div>
              }

              <div className='c-form__line'>
                <div className='c-form__field c-form__field--translation'>
                  <TextareaAutosize 
                    onChange={e => setFlashcard({...flashcard, translation: e.target.value})} 
                    value={flashcard.translation} id='translation' className='c-form__input' 
                    placeholder='translation' spellCheck='false' maxLength='320'
                  />
                  <label className='c-form__label' htmlFor='translation'>Translation</label>
                </div>
              </div>

              { error &&
                <div className='c-form__line'>
                  <div className='c-form__error'>
                    <span className='c-form__error-text'>{error}</span>
                  </div>
                </div>
              }
            </form>
          </div>
        </div>
        <div className='c-nav'>
          <div className='c-nav-item'>
            <button type='button' className='c-nav-item__link' onClick={() => {handleLeave(); history.goBack()}}>
              <Button direction='left'/>
            </button>
          </div>
          <div className='c-nav-item'>
            <button form='form_create_flashcard' className='c-nav-item__link'>
              <Button text='save'/>
            </button>   
          </div>
        </div>
      </div>
    </>
  )
}