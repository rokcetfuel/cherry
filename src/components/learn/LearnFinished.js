import React from 'react'

export default function LearnFinished(props) {
  const { count, again, done } = props

  return (
    <div className='c-learn-finished'>
      <div className='c-main'>
        good job! 
        you revised all {count} phrases.

        <button onClick={again}>go again</button>
        <button onClick={done}>done</button>
      </div>
    </div>
  )
}