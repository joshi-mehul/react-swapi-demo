// @flow weak

/* eslint no-unused-vars:0 */
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import * as viewsActions      from '../../redux/modules/views';
import * as userAuthActions   from '../../redux/modules/userAuth';
import {Home, Login} from '../../views';
import gql                    from 'graphql-tag';
import { graphql }            from 'react-apollo';


/* -----------------------------------------
  GraphQL - Apollo client
 ------------------------------------------*/

const logUser = gql`
  query logUser($name: String!) {
    people_search(value: $name) {
      name,
      birth_year
    }
  }
`;


// 1- add queries:

// 2- add mutation "logUser":
const LoginWithQuery = graphql(
  logUser,
{
  name: 'logUserFun',
    props: ({ ownProps, logUserFun }) => ({
    loginUser(name) {
    return logUserFun.refetch(name)
      .then(
        (
          {
            data: {
              people_search
            }
          }
        ) => {
          const {name, birthYear} = people_search[0];
          const token = `${birthYear}askdjliaslk${name}`;
          ownProps.onUserLoggedIn(token, people_search[0]);
          return Promise.resolve();
        }
      )
      .catch(
        (error) => {
          ownProps.onUserLogError(error);
          return Promise.reject(error);
        }
      )
    },
    name: ownProps.name,
}),
options: ({name}) => ({
  fetchPolicy: !name? 'cache-and-network' : undefined,
  variables: {
    name: name // ownProps are the props that are added from the parent component
  },
})
}
)(Login);


/* -----------------------------------------
  Redux
 ------------------------------------------*/

const mapStateToProps = (state) => {
  return {
    // views props:
    currentView:  state.views.currentView,
    // user Auth props:
    userIsAuthenticated: state.userAuth.isAuthenticated,
    // errors:
    error: state.userAuth.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      // views actions:
      enterLogin: viewsActions.enterLogin,
      leaveLogin: viewsActions.leaveLogin,

      // userAuth actions:
      onUserLoggedIn: userAuthActions.receivedUserLoggedIn,
      onUserLogError: userAuthActions.errorUserLoggedIn,
      setMutationLoading: userAuthActions.setLoadingStateForUserLogin,
      setTempUser: userAuthActions.setTempUser,
      unsetMutationLoading: userAuthActions.unsetLoadingStateForUserLogin,
      resetError: userAuthActions.resetLogError
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginWithQuery);
