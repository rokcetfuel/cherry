import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../visual/Button'

export default function Start() {
  return (
    <div className='c-view c-view--full c-start'>
      <div className='c-header c-header--custom'>
        <div className='c-header-logo'>
          cherry
        </div>
      </div>
      <div className='c-main'>
        <div className='c-start-create'>
          <div className='c-start-create__circle'>
            <div className='c-start-create__content'>
              <div className='c-start-create__header c-font__header'>
                create simple flashcards
              </div>
              <div className='c-start-create__text c-font__text'>
                learn your target language your way
              </div>
            </div>
          </div>
        </div>
        <div className='c-start-links'>
          <div className='c-start-links__circle'>
            <div className='c-start-links__content'>
              <Link className='c-start-links__link' to='/login'>
                <Button text='login' />
              </Link>
              <Link className='c-start-links__link' to='/register'>
                <Button text='register' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}