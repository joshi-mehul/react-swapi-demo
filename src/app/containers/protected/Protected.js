// @flow weak

import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import * as viewsActions      from '../../redux/modules/views';
import * as planetSearchActions      from '../../redux/modules/planetSearch';
import { Protected }          from '../../views';
import gql                    from 'graphql-tag';
import { graphql }            from 'react-apollo';


/* -----------------------------------------
  GraphQL - Apollo client
 ------------------------------------------*/

const searchPlane = gql`
  query searchPlanet($search: String!) { 
    planets_search(value: $search) {
      name
      gravity
      population
      diameter
      terrain
      orbital_period
      surface_water
      created
      climate
    }
  }
`;


// 1- add queries:

// 2- add mutation "logUser":
const ProtectedWithQuery = graphql(
  searchPlane,
  {
    name: 'searchPlanetFun',
    props: ({ ownProps, searchPlanetFun }) => ({
      searchPlanet(search) {
        ownProps.setLoadingStateForPlanetSearch();
        return searchPlanetFun.refetch(search)
          .then(
            (
              {
                data: {
                  planets_search
                }
              }
            ) => {
              ownProps.unsetLoadingStateForPlanetSearch();
              ownProps.receivedPlanets(planets_search);
              return Promise.resolve();
            }
          )
          .catch(
            (error) => {
              //ownProps.onUserLogError(error);
              return Promise.reject(error);
            }
          )
      },
      name: ownProps.name,
    }),
    options: ({search}) => ({
      fetchPolicy: !search? 'cache-and-network' : undefined,
      variables: {
        search: search // ownProps are the props that are added from the parent component
      },
    })
  }
)(Protected);



/* -----------------------------------------
  Redux
 ------------------------------------------*/
const mapStateToProps = (state) => {
  return {
    currentView:  state.views.currentView,
    planets:      state.planetSearch.planets
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      receivedPlanets: planetSearchActions.receivedPlanets,
      setLoadingStateForPlanetSearch: planetSearchActions.setLoadingStateForPlanetSearch,
      unsetLoadingStateForPlanetSearch: planetSearchActions.unsetLoadingStateForPlanetSearch,
      enterProtected: viewsActions.enterProtected,
      leaveProtected: viewsActions.leaveProtected
    },
    dispatch
  );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProtectedWithQuery);
