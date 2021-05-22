import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../visual/Button'

export default function Settings() {
  return (
    <div className="c-view c-view--nav-first-white c-settings">
      <div className='c-header'>
        <div className='c-header-name'>
          settings
        </div>
      </div>
      <div className='c-main'>
        <div className='c-settings-list'>
          <Link className='c-card' to={'/setups'}>
            <div className='c-card__content'>
              <div className='c-card__top'>
                <div className='c-card__title'>
                  setups
                </div>
              </div>
              <div className='c-card__bottom'>
                <div className='c-card__description'>
                  switch, edit or create a new setup
                </div>
              </div>
            </div>
            <div className='c-card__side'>
              <div className='c-card__btn'>
                <Button direction='right' />
              </div>
            </div>
          </Link>
          <Link className='c-card' to={'/account'}>
            <div className='c-card__content'>
              <div className='c-card__top'>
                <div className='c-card__title'>
                  account
                </div>
              </div>
              <div className='c-card__bottom'>
                <div className='c-card__description'>
                  manage your user data
                </div>
              </div>
            </div>
            <div className='c-card__side'>
              <div className='c-card__btn'>
                <Button direction='right' />
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className='c-nav'>
        <div className='c-nav-item'>
          <Link className='c-nav-item__link' to='/home'>
            <Button direction='left' />
          </Link>
        </div>
      </div>
    </div>
  )
}