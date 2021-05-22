import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import TextareaAutosize from 'react-textarea-autosize'
import { editSetup, removeSetup, cleanDataError } from '../../state/dataSlice'
import Button from '../visual/Button'
import Loading from '../visual/Loading'
import Switch from '../visual/Switch'
import Confirm from '../visual/Confirm'

export default function EditSetup() {
  const history = useHistory()
  const dispatch = useDispatch()

  /**
   * Setups
   */
  const setups = useSelector(state => state.data.setups)
  const setupId = useSelector(state => state.data.currentSetup)
  const [setup, setSetup] = useState(setups.filter(thisSetup => thisSetup.id === setupId)[0])
  const [initialSetupName] = useState(setup.name)
  
  /**
   * Edit Setup
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(editSetup(setup)).then(({payload}) => {
      if (!payload.error) history.push('/setups')
    })
  }

  /**
   * Remove Setup
   */
  const [remove, setRemove] = useState(false)

  const handleRemoveSetup = (e) => {
    e.preventDefault()
    setRemove(false)

    dispatch(removeSetup(setupId)).then(({payload}) => {
      if (!payload.error) history.push('/setups')
    })
  }
  
  const removeAttributes = {
    heading: 'Removing setup',
    element: initialSetupName,
    action: 'Are you sure you want to remove this setup and all included flashcards?',
    textYes: 'yes, remove it',
    textNo: 'no, come back',
    handleYes: handleRemoveSetup, 
    handleNo: () => setRemove(false)
  }

  /**
   * Validation
   */
  const loading = useSelector(state => state.data.status.loading)
  const error = useSelector(state => state.data.status.error)
  const handleLeave = () => dispatch(cleanDataError())

  /**
   * Render
   */
  return (
    <>
      { loading && <Loading /> }
      { remove && <Confirm attributes={removeAttributes} /> }
      <div className="c-view c-view--nav-first-white c-edit-setup">
        <div className='c-header'>
          <div className='c-header-name'>
            edit setup
          </div>
          <div className='c-header-text'></div>
          <div className='c-edit-setup__remove'>
            <div className='c-edit-setup__remove-circle' onClick={() => setRemove(true)}>
              remove setup
            </div>
          </div>
        </div>
        <div className='c-main'>
          <div className='c-form'>
            <form id='form_edit_setup' onSubmit={handleSubmit}>
                <div className='c-form__line'>
                  <div className='c-form__field'>
                    <TextareaAutosize 
                      className='c-form__input' type='text' id='name' 
                      placeholder='name' spellCheck='false' maxLength='320'
                      value={setup.name} onChange={e => setSetup({...setup, name: e.target.value})} 
                    />
                    <label className='c-form__label' htmlFor='name'>name</label>
                  </div>
                </div>
                <div className='c-form__line'>
                  <div className='c-form__field c-form__switch'>
                    <Switch 
                      id='pronunciation' switchValue={setup.pronunciation} 
                      switchOnChange={() => setSetup({...setup, pronunciation: !setup.pronunciation})}
                    />
                    <label className='c-form__label' htmlFor='pronunciation'>
                      { setup.pronunciation ? 'with pronunciation' : 'without pronunciation' }
                    </label>
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
            <Link className='c-nav-item__link' to='/setups' onClick={handleLeave}>
              <Button direction='left' />
            </Link>
          </div>
          <div className='c-nav-item'>
            <button className='c-nav-item__link' form='form_edit_setup'>
              <Button text='save' />
            </button>
          </div>
        </div>  
      </div>
    </>
  )
}