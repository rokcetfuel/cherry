import React from 'react'

export default function Filter(props) {
  const { onConfirm, onReturn } = props

  return (
    <div className='c-modal c-filter'>
      Filters
      <button onClick={onReturn}>
        Return
      </button>
      <button onClick={onConfirm}>
        Confirm
      </button>
    </div>
  )
}