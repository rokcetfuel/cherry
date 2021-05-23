import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firebase from '../firebase'

const firestore = firebase.firestore()

/**
 * Thunks
 */
export const initializeData = createAsyncThunk(
  'data/initializeData', async (uid) => {
    let data = null

    if (uid) {
      const userDoc = await firestore.collection('users').doc(uid).get()
      
      if (userDoc.exists) {
        const setupsData = await firestore.collection('users/' + uid + '/setups').get()
        const setups = setupsData.docs.length > 0 ? setupsData.docs.map((doc) => ({id: doc.id, ...doc.data()})) : null

        if (setups) {
          const currentSetup = userDoc.data().currentSetup ? userDoc.data().currentSetup : setups[0].id
          data = {
            currentSetup: currentSetup,
            setups: setups
          }

          if (currentSetup) {
            const flashcardsData = await firestore.collection('users/' + uid + '/flashcards').where('setup', '==', currentSetup).get()
            const flashcards = flashcardsData.docs.length > 0 ? flashcardsData.docs.map((doc) => ({id: doc.id, ...doc.data()})) : null

            if (flashcards) {
              data = {
                ...data,
                flashcards: flashcards
              }
            }
          }
        }
      } else {
        await firestore.collection('users').doc(uid).set({})
      }
    }

    return data
  }
)

export const createSetup = createAsyncThunk(
  'data/createSetup',
  async ({name, pronunciation}, {getState}) => {
    if (name.length > 0) {
      const state = getState()
      const uid = state.auth.user.uid
      const sortBy = 'created'

      /**
       * Update Firestore
       */
      const setupDoc = await firestore.collection('users/' + uid + '/setups').add({
        name: name,
        pronunciation: pronunciation,
        sort: sortBy
      })

      await firestore.collection('users').doc(uid).update({currentSetup: setupDoc.id})

      /**
       * Update State
       */
      const newSetup = {
        id: setupDoc.id,
        name: name, 
        pronunciation: pronunciation,
        sort: sortBy
      }

      let setups = state.data.setups ? state.data.setups.map(a => Object.assign({}, a)) : []
      setups.push(newSetup)

      return {
        currentSetup: setupDoc.id,
        setups: setups
      }
    }

    return {
      error: 'Setup name cannot be empty'
    }
  }
)

export const switchSetup = createAsyncThunk(
  'data/switchSetup',
  async (id, {getState}) => {
    const state = getState()
    const uid = state.auth.user.uid

    /**
     * Update Firestore
     */
    await firestore.collection('users').doc(uid).update({currentSetup: id})

    /**
     * Get new flashcards
     */
    const flashcardsData = await firestore.collection('users/' + uid + '/flashcards').where('setup', '==', id).get()
    const flashcards = flashcardsData.docs.length > 0 ? flashcardsData.docs.map((doc) => ({id: doc.id, ...doc.data()})) : null
    
    return {
      currentSetup: id,
      flashcards: flashcards
    }
  }
)

export const editSetup = createAsyncThunk(
  'data/editSetup',
  async ({id, name, pronunciation}, {getState}) => {
    if (name.length > 0) {
      const state = getState()
      const uid = state.auth.user.uid

      /**
       * Update Firestore
       */
      await firestore.collection('users/' + uid + '/setups').doc(id).update({
        name: name,
        pronunciation: pronunciation
      })

      /**
       * Update State
       */
      let setups = state.data.setups ? state.data.setups.map(a => Object.assign({}, a)) : []
      const setupIndex = setups.findIndex((a => a.id === id))
      setups[setupIndex].name = name
      setups[setupIndex].pronunciation = pronunciation

      return {
        setups: setups
      }
    }

    return {
      error: 'Setup name cannot be empty'
    }
  }
)

export const removeSetup = createAsyncThunk(
  'data/removeSetup',
  async (id, {getState}) => {
    const state = getState()
    const uid = state.auth.user.uid

    /**
     * Get newSetups & newCurrentSetup
     */
    let newSetups = state.data.setups.map(a => Object.assign({}, a))
    const setupIndex = newSetups.findIndex((a => a.id === id))
    newSetups.splice(setupIndex, 1);
    const newCurrentSetup = newSetups.length > 0 ? newSetups[0].id : null

    /**
     * Get old flashcards
     */
    const setupFlashcards = await firestore.collection('users/' + uid + '/flashcards').where('setup', '==', id).get()

    /**
     * Perform Batches (remove setup & flashcards, update currentSetup)
     */
    const setupDoc = firestore.collection('users/' + uid + '/setups').doc(id)
    const userDoc = firestore.collection('users').doc(uid)
    const removeBatches = []
    let operationCounter = 0
    let batchIndex = 0
    
    // Start batches
    removeBatches.push(firestore.batch())
  
    // Perform changes
    setupFlashcards.forEach(doc => {
      removeBatches[batchIndex].delete(doc.ref)
      operationCounter++;
    
      if (operationCounter === 495) {
        removeBatches.push(firestore.batch());
        operationCounter = 0
        batchIndex++
      }
    })
    removeBatches[batchIndex].delete(setupDoc)
    removeBatches[batchIndex].update(userDoc, {currentSetup: newCurrentSetup})
    
    // Commit all batches
    removeBatches.forEach(async batch => await batch.commit())

    /**
     * Get new flashcards
     */
    let newFlashcards = null
    if (newCurrentSetup) {
      const newFlashcardsData = await firestore.collection('users/' + uid + '/flashcards').where('setup', '==', newCurrentSetup).get()
      newFlashcards = newFlashcardsData.docs.length > 0 ? newFlashcardsData.docs.map((doc) => ({id: doc.id, ...doc.data()})) : null
    }

    return {
      setups: newSetups, 
      currentSetup: newCurrentSetup,
      flashcards: newFlashcards
    }
  }
)

export const createFlashcard = createAsyncThunk(
  'data/createFlashcard',
  async ({phrase, translation, pronunciation}, {getState}) => {
    if (phrase.length > 0 && translation.length > 0) {
      const state = getState()
      const uid = state.auth.user.uid
      const currentSetup = state.data.currentSetup
      const timestamp = Date.now()

      /**
       * Update Firestore
       */
      const flashcardDoc = await firestore.collection('users/' + uid + '/flashcards').add({
        setup: currentSetup,
        phrase: phrase, 
        translation: translation,
        pronunciation: pronunciation,
        created: timestamp
      })

      /**
       * Update State
       */
      const newFlashcard = {
        id: flashcardDoc.id,
        setup: currentSetup,
        phrase: phrase, 
        translation: translation,
        pronunciation: pronunciation,
        created: timestamp
      }

      let flashcards = state.data.flashcards ? state.data.flashcards.map(a => Object.assign({}, a)) : []
      flashcards.push(newFlashcard)

      return {
        flashcards: flashcards
      }
    }

    return {
      error: 'Flashcard must have a phrase and translation.'
    }
  }
)

export const editFlashcard = createAsyncThunk(
  'data/editFlashcard',
  async ({id, phrase, translation, pronunciation}, {getState}) => {
    if (phrase.length > 0 && translation.length > 0) {
      const state = getState()
      const uid = state.auth.user.uid
      const timestamp = Date.now()

      /**
       * Update Firestore
       */
      await firestore.collection('users/' + uid + '/flashcards').doc(id).update({
        phrase: phrase, 
        translation: translation,
        pronunciation: pronunciation,
        edited: timestamp
      })

      /**
       * Update State
       */
      let flashcards = state.data.flashcards ? state.data.flashcards.map(a => Object.assign({}, a)) : []
      const flashcardIndex = flashcards.findIndex((a => a.id === id))
      flashcards[flashcardIndex].phrase = phrase
      flashcards[flashcardIndex].translation = translation
      flashcards[flashcardIndex].pronunciation = pronunciation
      flashcards[flashcardIndex].edited = timestamp

      return {
        flashcards: flashcards
      }
    }

    return {
      error: 'Flashcard must have a phrase and translation.'
    }
  }
)

export const removeFlashcard = createAsyncThunk(
  'data/removeFlashcard',
  async ({id}, {getState}) => {
    const state = getState()
    const uid = state.auth.user.uid

    /**
     * Update Firestore
     */
    await firestore.collection('users/' + uid + '/flashcards').doc(id).delete()

    /**
     * Update State
     */
    let flashcards = state.data.flashcards.map(a => Object.assign({}, a))
    const flashcardIndex = flashcards.findIndex((a => a.id === id))
    flashcards.splice(flashcardIndex, 1)

    return {
      flashcards: flashcards
    }
  }
)

/**
 * Slice
 */
export const dataSlice = createSlice({
  name: 'data',

  initialState: {
    status: {
      onceInitialized: false,
      initializedData: false,
      loading: false,
      error: null
    },
    currentSetup: null,
    setups: null,
    flashcards: null
  },

  reducers: {
    cleanDataError: (state) => {
      state.status.error = null
    }
  },

  extraReducers: {
    /**
     * Initialize Date
     */
    [initializeData.pending]: (state) => {
      state.status.initializedData = false
      state.status.loading = true
      state.status.error = null
    },
    [initializeData.fulfilled]: (state, { payload }) => {
      state.status.onceInitialized = true
      state.status.initializedData = true
      state.status.loading = false

      if (payload) {
        const { currentSetup, setups, flashcards } = payload
        state.currentSetup = currentSetup ? currentSetup : null
        state.setups = setups ? setups : null
        state.flashcards = flashcards ? flashcards : null
      } else {
        state.currentSetup = null
        state.setups = null
        state.flashcards = null
      }
    },
    [initializeData.rejected]: (state, { error }) => {
      state.status.onceInitialized = true
      state.status.initializedData = true
      state.status.loading = false
      state.status.error = error.message
    },

    /**
     * Create Setup
     */
    [createSetup.pending]: (state) => {
      state.status.loading = true
      state.status.error = null
    },
    [createSetup.fulfilled]: (state, { payload }) => {
      const { error, currentSetup, setups } = payload
      state.status.loading = false

      if (error) {
        state.status.error = error
      } else {
        state.currentSetup = currentSetup
        state.setups = setups
        state.flashcards = null
      }
    },
    [createSetup.rejected]: (state, { error }) => {
      state.status.error = error.message
      state.status.loading = false
    },

    /**
     * Switch Setup
     */
    [switchSetup.pending]: (state) => {
      state.status.loading = true
      state.status.error = null
    },
    [switchSetup.fulfilled]: (state, { payload }) => {
      const { currentSetup, flashcards } = payload
      state.status.loading = false
      state.currentSetup = currentSetup
      state.flashcards = flashcards
    },
    [switchSetup.rejected]: (state, { error }) => {
      state.status.loading = false
      state.status.error = error.message
    },

    /**
     * Edit Setup
     */
    [editSetup.pending]: (state) => {
      state.status.loading = true
      state.status.error = null
    },
    [editSetup.fulfilled]: (state, { payload }) => {
      const { error, setups } = payload
      state.status.loading = false

      if (error) {
        state.status.error = error
      } else {
        state.setups = setups
      }
    },
    [editSetup.rejected]: (state, { error }) => {
      state.status.error = error.message
      state.status.loading = false
    },

    /**
     * Remove Setup
     */
    [removeSetup.pending]: (state) => {
      state.status.loading = true
      state.status.error = null
    },
    [removeSetup.fulfilled]: (state, { payload }) => {
      const { setups, currentSetup, flashcards } = payload
      state.status.loading = false
      state.setups = setups
      state.currentSetup = currentSetup
      state.flashcards = flashcards
    },
    [removeSetup.rejected]: (state, { error }) => {
      state.status.error = error.message
      state.status.loading = false
    },

    /**
     * Create Flashcard
     */
    [createFlashcard.pending]: (state) => {
      state.status.loading = true
      state.status.error = null
    },
    [createFlashcard.fulfilled]: (state, { payload }) => {
      const { error, flashcards } = payload
      state.status.loading = false

      if (error) {
        state.status.error = error
      } else {
        state.flashcards = flashcards
      }
    },
    [createFlashcard.rejected]: (state, { error }) => {
      state.status.error = error.message
      state.status.loading = false
    },

    /**
     * Edit Flashcard
     */
    [editFlashcard.pending]: (state) => {
      state.status.loading = true
      state.status.error = null
    },
    [editFlashcard.fulfilled]: (state, { payload }) => {
      const { error, flashcards } = payload
      state.status.loading = false

      if (error) {
        state.status.error = error
      } else {
        state.flashcards = flashcards
      }
    },
    [editFlashcard.rejected]: (state, { error }) => {
      state.status.error = error.message
      state.status.loading = false
    },

    /**
     * Remove Flashcard
     */
    [removeFlashcard.pending]: (state) => {
      state.status.loading = true
      state.status.error = null
    },
    [removeFlashcard.fulfilled]: (state, { payload }) => {
      const { flashcards } = payload
      state.status.loading = false
      state.flashcards = flashcards
    },
    [removeFlashcard.rejected]: (state, { error }) => {
      state.status.error = error.message
      state.status.loading = false
    },
  }
})

export const { cleanDataError } = dataSlice.actions
export default dataSlice.reducer