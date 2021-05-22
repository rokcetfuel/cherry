import React from 'react'

export default function Confirm(props) {
  const { attributes: {
    heading, element, action, handleYes, handleNo, textYes, textNo
  }} = props

  return (
    <div className='c-modal c-confirm'>
      <div className='c-confirm__content'>
        <div className='c-confirm__top'>
          <div className='c-confirm__heading'>{heading}</div>
          <div className='c-confirm__element'>{element}</div>
        </div>
        <div className='c-confirm__bottom'>
          <div className='c-confirm__action'>{action}</div>
          <div className='c-confirm__buttons'>
            <button className='c-btn-link c-confirm__btn' onClick={handleNo}>{textNo}</button>
            <button className='c-btn-link c-confirm__btn' onClick={handleYes}>{textYes}</button>
          </div>
        </div>
      </div>
    </div>
  )
}