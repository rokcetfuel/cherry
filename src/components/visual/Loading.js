import React from 'react'

export default function Loading(props) {
  const { hideText } = props

  return (
    <div className='c-modal c-loading'>
      <div className='c-loading__content'>
        { !hideText && <span className='c-loading__text'>Loading</span> }
        <span className='c-loading__dots'>
          <span className='c-dot'></span>
          <span className='c-dot'></span>
          <span className='c-dot'></span>
        </span>
      </div>
    </div>
  )
}