import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Home() {
  const setups = useSelector(state => state.data.setups)
  const currentSetupId = useSelector(state => state.data.currentSetup)
  const currentSetup = setups.filter(setup => setup.id === currentSetupId)[0]

  return (
    <div className='c-view c-view--full c-home'>
      <div className='c-header c-header--custom'>
        <div className='c-header-logo'>
          cherry
        </div>
      </div>
      <div className='c-main'>
        <div className='c-home-one'>
          <div className='c-home-create'>
            <div className='c-home-create__box'>
              <Link to='/flashcards/new'>
                create flashcard
              </Link>
            </div>
          </div>
          <div className='c-home-setup'>
            <div className='c-home-setup__box'>
              <div className='c-home-setup__header'>
                setup
              </div>
              <div className='c-home-setup__name'>
                {currentSetup.name}
              </div>
            </div>
          </div>
        </div>
        <div className='c-home-two'>
          <div className='c-home-browse'>
            <Link to='/flashcards'>
              browse flashcards
            </Link>
          </div>
        </div>
        <div className='c-home-nav'>
          <Link to='/settings'>
            <div className='c-nav-burger'>
              <div className='c-nav-burger__line'></div>
              <div className='c-nav-burger__line'></div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}