// @flow weak

import moment     from 'moment';
import { auth }   from '../../services/auth';

const dateFormat = 'DD/MM/YYYY HH:mm';

/* -----------------------------------------
  constants
 ------------------------------------------*/

const RECEIVED_PLANETS        = 'RECEIVED_PLANETS';
const ERROR_PLANETS_SEARCH           = 'ERROR_PLANETS_SEARCH';

const SET_LOADING_PLANETS_SEARCH          = 'SET_LOADING_PLANETS_SEARCH';
const UNSET_LOADING_PLANETS_SEARCH        = 'UNSET_LOADING_PLANETS_SEARCH';

const RESET_SEARCH_ERRORS               = 'RESET_SEARCH_ERRORS';

/* -----------------------------------------
  Reducer
 ------------------------------------------*/
const emptyPlanet = {
  name:   '',
  gravity:   '',
  population:   '',
  diameter:   '',
  terrain:   '',
  orbital_period:   '',
  surface_water:   '',
  created:   '',
  climate:   '',
};

const initialState = {
  errors:           null,
  ...[emptyPlanet]
};

export default function (state = initialState, action) {
  switch (action.type) {
    case RECEIVED_PLANETS:
      console.log('planets in action result', action.planets);
    return {
      ...state,
      planets: action.planets
    };

  case ERROR_PLANETS_SEARCH:
    return {
      ...state,
      lastActionTime:   action.time,
      // errors:
      error: {...action.error},
    };

  case SET_LOADING_PLANETS_SEARCH:
  case UNSET_LOADING_PLANETS_SEARCH:
    return {
      ...state,
      lastActionTime:  action.time,
      loading: action.loading
    };

  case RESET_SEARCH_ERRORS:
    return {
      ...state,
      error: null
    };

  default:
    return state;
  }
}

/* -----------------------------------------
  action creators
 ------------------------------------------*/

// //////////////////
// Planet search sucess:
// //////////////////
export function receivedPlanets( planets = [emptyPlanet], time = moment().format(dateFormat)) {

  return {
    type: RECEIVED_PLANETS,
    time,
    planets
  };
}
// //////////////////
// search error:
// //////////////////
export function errorPlanetsSearch(error = null, time = moment().format(dateFormat)) {
  return {
    type: ERROR_PLANETS_SEARCH,
    time,
    error,
  };
}
// /////////////////////////////
// set loading state for search
// /////////////////////////////
export function setLoadingStateForPlanetSearch(time = moment().format(dateFormat)) {
  return {
    type: SET_LOADING_PLANETS_SEARCH,
    time,
    loading: true
  };
}
// /////////////////////////////
// unset loading state for search
// /////////////////////////////
export function unsetLoadingStateForPlanetSearch(time = moment().format(dateFormat)) {
  return {
    type: UNSET_LOADING_PLANETS_SEARCH,
    time,
    loading: false
  };
}

// ////////////////////////////////
// reset search error:
// ////////////////////////////////
export function resetSearchError() {
  return {
    type: RESET_SEARCH_ERRORS
  };
}
