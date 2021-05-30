import React from 'react'

export default function LearnFinished(props) {
  const { count, again, done } = props

  return (
    <>
      <div className='c-main'>
        <div className='c-learn-finish__top'>
          <span className='c-btn'>
            good job!
          </span>
        </div>
        <div className='c-learn-finish__bottom'>
          <div className='c-learn-finish__text'>
            You revised <span>{count}</span> phrases.
          </div>
          <div className='c-learn-finish__actions'>
            <button className='c-learn-finish__actions-btn' onClick={again}>
              go again
            </button>  
            <button className='c-learn-finish__actions-btn' onClick={done}>
              done
            </button>  
          </div>
        </div>
      </div>
    </>
  )
}