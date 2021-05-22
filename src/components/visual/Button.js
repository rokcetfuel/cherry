import React from 'react'
import arrowSvg from '../../assets/img/arrow.svg'

export default function Button(props) {
  const { direction, text } = props
  const directionClass = direction ? ` c-btn-arrow c-btn-arrow--${direction}` : ``
  const arrow = <img src={arrowSvg} alt='' />

  return (
    <span className={`c-btn${directionClass}`}>
      { text ? text : arrow }
    </span>
  )
}