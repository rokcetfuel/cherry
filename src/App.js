import React from 'react';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import ScrollMemory from 'react-router-scroll-memory'

import DataProvider from './components/DataProvider'
import PublicRoute from './components/router/PublicRoute'
import PrivateRoute from './components/router/PrivateRoute'

import Start from './components/auth/Start'
import Login from './components/auth/Login'
import Register from './components/auth/Register'

import Home from './components/Home'
import Flashcards from './components/flashcards/Flashcards'
import Flashcard from './components/flashcards/Flashcard'
import NewFlashcard from './components/flashcards/NewFlashcard'

import Settings from './components/settings/Settings'
import Setups from './components/settings/Setups'
import NewSetup from './components/settings/NewSetup'
import EditSetup from './components/settings/EditSetup'
import Account from './components/settings/Account'

import Learn from './components/learn/Learn'

function App() {
  return (
    <DataProvider>
      <Router>
        <ScrollMemory />
        <Switch>
          <PublicRoute path='/' exact component={Start} />
          <PublicRoute path='/login' exact component={Login} />
          <PublicRoute path='/register' exact component={Register} />
          <PrivateRoute path='/home' exact component={Home} />
          <PrivateRoute path='/settings' exact component={Settings} />
          <PrivateRoute path='/account' exact component={Account} />
          <PrivateRoute path='/setups' exact component={Setups} />
          <PrivateRoute path='/setups/new' exact component={NewSetup} />
          <PrivateRoute path='/setups/edit' exact component={EditSetup} />
          <PrivateRoute path='/flashcards' exact component={Flashcards} />
          <PrivateRoute path='/flashcards/new' exact component={NewFlashcard} />
          <PrivateRoute path='/flashcard/:id' component={Flashcard} />
          <PrivateRoute path='/learn' exact component={Learn} />
          <Redirect to='/' />
        </Switch>
      </Router>
    </DataProvider>
  );
}

export default App;