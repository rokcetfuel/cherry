import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { switchSetup } from '../../state/dataSlice'
import Button from '../visual/Button'
import Loading from '../visual/Loading'

export default function Setups() {
  const history = useHistory()
  const dispatch = useDispatch()
  const loading = useSelector(state => state.data.status.loading)
  const setups = useSelector(state => state.data.setups)
  const currentSetupId = useSelector(state => state.data.currentSetup)
  const currentSetup = setups.filter(setup => setup.id === currentSetupId)[0]

  /**
   * Switch Setup
   */
  const handleSwitchSetup = (setup) => {
    dispatch(switchSetup(setup)).then(({payload}) => {
      if (!payload.error) history.push('/home')
    })
  }

  /**
   * Render
   */
  return (
    <>
      { loading && <Loading /> }
      <div className="c-view c-view--nav-first-white c-setups">
        <div className='c-header'>
          <div className='c-header-name'>
            setups
          </div>
        </div>
        <div className='c-main'>
          <div className='c-section c-setups-current'>
            <div className='c-section__header'>
              <div className='c-section__header-name'>
                current setup
              </div>
              <div className='c-section__header-link'>
                <Link to='/setups/edit' className='c-btn-dots'>···</Link>
              </div>
            </div>
            <div className='c-section__content'>
              <div className='c-section__line'>
                <div className='c-section-text'>
                  {currentSetup.name}
                </div>
              </div>
            </div>
          </div>

          { setups.length > 1 &&
            <div className='c-section c-setups-switch'>
              <div className='c-section__header'>
                <div className='c-section__header-name'>
                  switch setup
                </div>
              </div>
              <div className='c-section__content'>
                {setups.map((setup) => setup.id !== currentSetup.id &&
                  <div className='c-section__line' key={setup.id}>
                    <div className='c-section-link' onClick={() => handleSwitchSetup(setup.id)}>
                      <div className='c-section-link__name'>{setup.name}</div>
                      <div className='c-section-link__btn'>
                        <Button direction='right' />
                      </div>
                    </div> 
                  </div>
                )}
              </div>
            </div>
          }
        </div>

        <div className='c-nav'>
          <div className='c-nav-item'>
            <Link className='c-nav-item__link' to='/settings'>
              <Button direction='left' />
            </Link>
          </div>
          <div className='c-nav-item'>
            <Link className='c-nav-item__link' to='/setups/new'>
              <Button text='new setup' />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}