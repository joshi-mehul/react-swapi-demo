// @flow weak

import { combineReducers }      from 'redux';
import { routerReducer }        from 'react-router-redux';
import { apolloClient }         from '../../services/apollo';
import views                    from './views';
import userAuth                 from './userAuth';
import planetSearch                 from './planetSearch';

const appReducers = {
  views,
  userAuth,
  planetSearch
};

// combine reducers -> createStore reducer
const reducers = combineReducers({
  ...appReducers,
  apollo:   apolloClient.reducer(), // apollo reducer
  routing:  routerReducer
});

export default reducers;
