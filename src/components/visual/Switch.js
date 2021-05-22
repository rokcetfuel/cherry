import React from 'react'

export default function Switch(props) {
  const { id, switchValue, switchOnChange } = props

  return (
    <div className='c-switch'>
      <input 
        className="c-switch__input"
        type="checkbox" name={id} id={id}
        checked={switchValue} onChange={switchOnChange}
      />
      <div className="c-switch__toggle" htmlFor={id}>
        <div className="c-switch__toggle-dot"></div>
      </div>
    </div>
  )
}