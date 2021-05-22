import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { dateRelativeTime } from '../../helpers.js'
import { logout } from '../../state/authSlice.js'
import Button from '../visual/Button'

export default function Account() {
  const dispatch = useDispatch()
  const email = useSelector(state => state.auth.user.email)
  const created = useSelector(state => state.auth.user.created)
  const relativeCreated = dateRelativeTime(created)

  return (
    <div className='c-view c-view--nav-first-white c-account'>
      <div className='c-header'>
        <div className='c-header-name'>
          account
        </div>
      </div>
      <div className='c-main'>
        <div className='c-form'>
          <div className='c-form__line'>
            <div className='c-form__field'>
              <div className='c-form__input'>{email}</div>
              <div className='c-form__label'>e-mail</div>
            </div>
          </div>
          <div className='c-form__line'>
            <div className='c-form__field'>
              <div className='c-form__input'>{relativeCreated}</div>
              <div className='c-form__label'>joined</div>
            </div>
          </div>
        </div>
      </div>
      <div className='c-nav'>
        <div className='c-nav-item'>
          <Link className='c-nav-item__link' to='/settings'>
            <Button direction='left' />
          </Link>
        </div>
        <div className='c-nav-item'>
          <button className='c-nav-item__link' onClick={() => dispatch(logout())}>
            <Button text='log out' />
          </button>
        </div>
      </div>
    </div>
  )
}
