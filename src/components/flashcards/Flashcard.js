import React, { useState, useEffect } from 'react'
import { useHistory, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import containsChinese from 'contains-chinese'
import pinyin from 'chinese-to-pinyin'
import TextareaAutosize from 'react-textarea-autosize'

import { editFlashcard, removeFlashcard, cleanDataError } from '../../state/dataSlice.js'
import Button from '../visual/Button'
import Loading from '../visual/Loading'
import Confirm from '../visual/Confirm'
import { dateRelativeTime } from '../../helpers.js'

export default function Flashcard(props) {
  const history = useHistory()
  const dispatch = useDispatch()

  /**
   * Flashcard Data
   */
  const id = props.match.params.id
  const flashcards = useSelector(state => state.data.flashcards)
  const [flashcard, setFlashcard] = useState(flashcards.find(a => a.id === id))
  const [relativeCreated, setRelativeCreated] = useState(flashcard && flashcard.created ? dateRelativeTime(flashcard.created) : null)
  const [relativeEdited, setRelativeEdited] = useState(flashcard && flashcard.edited ? dateRelativeTime(flashcard.edited) : null)
  const [lastPhrase, setLastPhrase] = useState(flashcard ? flashcard.phrase : '')

  /**
   * Check flashcard changes
   */
  const [savedFlashcard, setSavedFlashcard] = useState(flashcards.find(a => a.id === id))
  const [flashcardChanged, setFlashcardChanged] = useState(false)
  useEffect(() => {
    if (flashcard && JSON.stringify(flashcard) !== JSON.stringify(savedFlashcard)) {
      setFlashcardChanged(true)
    } else {
      setFlashcardChanged(false)
    }
  }, [flashcard, savedFlashcard])

  /**
   * Pronunciaton Active
   */
  const currentSetup = useSelector(state => state.data.currentSetup)
  const setups = useSelector(state => state.data.setups)
  const pronunciation = setups.find(a => a.id === currentSetup).pronunciation

  /**
   * Handle Form
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(editFlashcard(flashcard)).then(({payload}) => {
      if (!payload.error) {
        const newFlashcard = payload.flashcards.find(a => a.id === id)

        setFlashcard(newFlashcard)
        setSavedFlashcard(newFlashcard)
        setFlashcardChanged(false)
        setRelativeCreated(dateRelativeTime(newFlashcard.created))
        setRelativeEdited(dateRelativeTime(newFlashcard.edited))
      }
    })
  }

  /**
   * Remove
   */
  const [remove, setRemove] = useState(false)

  const handleRemoveFlashcard = (e) => {
    e.preventDefault()
    setRemove(false)

    dispatch(removeFlashcard(flashcard)).then(({payload}) => {
      if (!payload.error) history.push('/flashcards')
    })
  }

  const removeAttributes = {
    heading: 'Removing flashcard',
    element: flashcard ? flashcard.phrase : '',
    action: 'Are you sure you want to remove this flashcard?',
    handleYes: handleRemoveFlashcard, 
    handleNo: () => setRemove(false),
    textYes: 'yes, remove it',
    textNo: 'no, come back'
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
    if (flashcard && flashcard.phrase !== lastPhrase) {
      setChinese(containsChinese(flashcard.phrase))
      setLastPhrase(flashcard.phrase)
    }
  }, [flashcard, lastPhrase])

  const generatePronunciation = () => {
    setFlashcard({...flashcard, pronunciation: pinyin(flashcard.phrase)})
    setChinese(false)
  }

  return (
    <>
      { loading && <Loading /> }
      { remove && <Confirm attributes={removeAttributes} /> }
      { flashcard ?
        <div className='c-view c-view--nav-last-white c-flashcard'>  
          <div className='c-main'>
            <div className='c-form'>
              <form id='form_edit_flashcard' autoComplete='off' onSubmit={handleSubmit}>
                <div className='c-form__line'>
                  <div className='c-form__field c-form__field--phrase'>
                    <TextareaAutosize 
                      value={flashcard.phrase} id='phrase' className='c-form__input' 
                      placeholder='phrase' spellCheck='false' maxLength='320'
                      onChange={e => {
                        setFlashcard({...flashcard, phrase: e.target.value})
                      }} 
                    />
                    <label className='c-form__label' htmlFor='phrase'>Phrase</label>
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
                      onChange={e => setFlashcard({...flashcard, translation: e.target.value})} value={flashcard.translation} 
                      id='translation' className='c-form__input' placeholder='translation' spellCheck='false' maxLength='320'
                    />
                    <label className='c-form__label' htmlFor='translation'>Translation</label>
                  </div>
                </div>

                <div className='c-form__line'>
                  <div className='c-form__field'>
                    <div className='c-form__input'>{relativeCreated}</div>
                    <div className='c-form__label'>created</div>
                  </div>

                  { relativeEdited &&
                    <div className='c-form__field'>
                      <div className='c-form__input'>{relativeEdited}</div>
                      <div className='c-form__label'>edited</div>
                    </div>
                  }
                </div>

                <div className='c-form__line'>
                  <div className='c-form__actions'>
                    <button className='c-btn-link' type="button" onClick={() => setRemove(true)}>
                      remove flashcard
                    </button>
                  </div>
                </div>

                { error &&
                  <div className='c-form__line'>
                    <div className='c-form__error'>
                      <span className='c-form__error-text'>
                        {error}
                      </span>
                    </div>
                  </div>
                }
              </form>
            </div>
          </div>
          <div className='c-nav'>
            <div className='c-nav-item'>
              <button className='c-nav-item__link' type='button' onClick={() => {handleLeave(); history.goBack()}}>
                <Button direction='left'/>
              </button>
            </div>
            <div className='c-nav-item'>
              <button disabled={!flashcardChanged} className='c-nav-item__link' form='form_edit_flashcard'>
                <Button text='save'/>
              </button> 
            </div>  
          </div>
        </div>
      : 
        <Redirect to='/flashcards' />
      }
    </>
  )
}