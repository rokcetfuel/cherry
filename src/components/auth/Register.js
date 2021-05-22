import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TextareaAutosize from 'react-textarea-autosize'
import { register } from '../../state/authSlice.js'
import { cleanAuthError } from '../../state/authSlice.js'
import { Link } from 'react-router-dom'
import Button from '../visual/Button'
import Loading from '../visual/Loading'

export default function Register() {
  const dispatch = useDispatch()

  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '' 
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(register(credentials))
  }

  /**
   * Validation
   */
  const loading = useSelector(state => state.auth.status.loading)
  const error = useSelector(state => state.auth.status.error)
  const handleLeave = () => dispatch(cleanAuthError())

  return (
    <>
      { loading ? <Loading /> : '' }
      <div className='c-view c-view--nav-last-white c-auth c-register'>
        <div className='c-header c-header--custom'>
          <div className='c-header-logo'>cherry</div>
          <div className='c-header-name'>register</div>
        </div>
        <div className='c-main'>
          <div className='c-form'>
            <form id='form_register' autoComplete='off' onSubmit={handleSubmit}>
              <div className='c-form__line'>
                <div className='c-form__field'>
                  <TextareaAutosize 
                    onChange={e => setCredentials({...credentials, email: e.target.value})} value={credentials.email} 
                    id='email' className='c-form__input' placeholder='e-mail' spellCheck='false' maxLength='320'
                  />
                  <label className='c-form__label' htmlFor='email'>E-mail</label>
                </div>
              </div>
              <div className='c-form__line'>
                <div className='c-form__field'>
                  <input 
                    onChange={e => setCredentials({...credentials, password: e.target.value})} value={credentials.password}
                    type='password' id='password' className='c-form__input' placeholder='password' maxLength='320'
                  />
                  <label className='c-form__label' htmlFor='password'>Password</label>
                </div>
              </div>
              { error ? 
              <div className='c-form__line'>
                <div className='c-form__error'>
                  <span className='c-form__error-text'>{error}</span>
                </div>
              </div>
              : ''}
            </form>
          </div>
        </div>
        <div className='c-nav'>
          <div className='c-nav-item'>
            <Link className='c-nav-item__link' to='/' onClick={handleLeave}>
              <Button direction='left'/>
            </Link>
          </div>
          <div className='c-nav-item'>
            <button className='c-nav-item__link' form='form_register'>
              <Button direction='right'/>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}