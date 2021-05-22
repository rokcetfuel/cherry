import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { initializeAuth } from '../state/authSlice'
import { initializeData } from '../state/dataSlice'
import Loading from './visual/Loading'

export default function DataProvider({ children }) {
  const initializedAuth = useSelector(state => state.auth.status.initializedAuth)
  const initializedData = useSelector(state => state.data.status.initializedData)
  const onceInitialized = useSelector(state => state.data.status.onceInitialized)
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  /*
  const state = useSelector(state => state)
  useEffect(() => {
    console.log(state)
  }, [state])
  */

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  useEffect(() => {
    if (initializedAuth) {
      let uid = user ? user.uid : null
      dispatch(initializeData(uid))
    }
  }, [user, initializedAuth, dispatch])

  return (
    initializedData ? <> {children} </> : <Loading hideText={!onceInitialized} />
  )
}