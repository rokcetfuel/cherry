import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firebase from '../firebase'

/**
 * Thunks
 */
export const initializeAuth = () => dispatch => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      dispatch(authorize({uid: user.uid, email: user.email, created: user.metadata.creationTime}))
    } else {
      dispatch(authorize(null))
    }
  })
}

export const login = createAsyncThunk(
  'auth/login',
  ({email, password}) => {
    return new Promise((resolve, reject) => {
      return firebase.auth().signInWithEmailAndPassword(email, password)
        .then(({user}) => {resolve({uid: user.uid, email: user.email, created: user.metadata.creationTime})})
        .catch((error) => reject(error))
    })
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async ({email, password}) => {
    return new Promise((resolve, reject) => {
      return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(({user}) => resolve({uid: user.uid, email: user.email, created: user.metadata.creationTime}))
        .catch((error) => reject(error))
    })
  }
)

export const logout = createAsyncThunk(
  'auth/logout', () => {
    return firebase.auth().signOut()
  }
)

/**
 * Slice
 */
export const authSlice = createSlice({
  name: 'auth',

  initialState: {
    status: {
      initializedAuth: false,
      loading: false,
      error: null
    },
    user: null
  },

  reducers: {
    authorize: (state, { payload }) => {
      state.status.initializedAuth = true
      if (payload) {
        state.user = {
          uid: payload.uid,
          email: payload.email,
          created: payload.created
        }
      }
    },
    cleanAuthError: (state) => {
      state.status.error = null
    }
  },

  extraReducers: {
    [login.pending]: (state) => {
      state.status.loading = true
      state.status.error = null
    },
    [login.fulfilled]: (state, { payload }) => {
      state.status.loading = false
      state.user = {
        uid: payload.uid,
        email: payload.email,
        created: payload.created
      }
    },
    [login.rejected]: (state, { error }) => {
      state.status.loading = false
      state.status.error = error.message
    },
    [register.pending]: (state) => {
      state.status.loading = true
      state.status.error = null
    },
    [register.fulfilled]: (state, { payload }) => {
      state.status.loading = false
      state.status.error = null
      state.user = {
        uid: payload.uid,
        email: payload.email,
        created: payload.created
      }
    },
    [register.rejected]: (state, { error }) => {
      state.status.loading = false
      state.status.error = error.message
    },
    [logout.pending]: (state) => {
      state.status.loading = true
      state.status.error = null
    },
    [logout.fulfilled]: (state) => {
      state.status.loading = false
      state.status.error = null
      state.user = null
    },
    [logout.rejected]: (state, { error }) => {
      state.status.loading = false
      state.status.error = error.message
    },
  }
})

export const { authorize, cleanAuthError } = authSlice.actions
export default authSlice.reducer