import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import TextareaAutosize from 'react-textarea-autosize'
import { createSetup, cleanDataError } from '../../state/dataSlice'
import Button from '../visual/Button'
import Loading from '../visual/Loading'
import Switch from '../visual/Switch'

export default function NewSetup() {
  const dispatch = useDispatch()
  const history = useHistory()
  const currentSetup = useSelector(state => state.data.currentSetup)

  const [setup, setSetup] = useState({ 
    name: '',
    pronunciation: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(createSetup(setup)).then(({payload}) => {
      if (!payload.error) history.push('/home')
    })
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
      <div className="c-view c-view--nav-first-white c-new-setup">
        <div className='c-header'>
          <div className='c-header-name'>
            create setup
          </div>
          <div className='c-header-text'>
            a setup is like a pack <br /> of flashcards
          </div>
        </div>
        <div className='c-main'>
          <div className='c-form'>
            <form id='form_create_setup' onSubmit={handleSubmit}>
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
            <Link className='c-nav-item__link' to={currentSetup ? '/setups' : '/account'} onClick={handleLeave}>
              <Button direction='left' />
            </Link>
          </div>
          <div className='c-nav-item'>
            <button className='c-nav-item__link' form='form_create_setup'>
              <Button text='create' />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}