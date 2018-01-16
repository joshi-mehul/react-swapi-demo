// @flow weak

import React, {
  PureComponent
}                     from 'react';
import PropTypes      from 'prop-types';
import cx             from 'classnames';
import { Link }       from 'react-router-dom';
import { ErrorAlert } from '../../components';

class Login extends PureComponent {
  static propTypes= {
    // react-router 4:
    match:    PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history:  PropTypes.object.isRequired,

    // views props:
    currentView: PropTypes.string.isRequired,
    enterLogin:  PropTypes.func.isRequired,
    leaveLogin:  PropTypes.func.isRequired,

    // apollo props:
    user: PropTypes.shape({
      username: PropTypes.string
    }),

    // auth props:
    userIsAuthenticated: PropTypes.bool.isRequired,
    //mutationLoading:     PropTypes.bool.isRequired,
    error:               PropTypes.object,

    // apollo actions
    loginUser: PropTypes.func.isRequired,

    // redux actions
    setTempUser: PropTypes.func.isRequired,
    onUserLoggedIn: PropTypes.func.isRequired,
    resetError:     PropTypes.func.isRequired
  };

  state = {
    viewEntersAnim: true,
    name:          '',
    birthYear:       ''
  };

  componentDidMount() {
    console.log(this.props);
    const { enterLogin } = this.props;
    enterLogin();
  }

  componentWillUnmount() {
    const { leaveLogin } = this.props;
    leaveLogin();
  }

  render() {
    const {
      viewEntersAnim,
      name,
      birthYear
    } = this.state;
    const {
      error
    } = this.props;

    return (
      <div className={cx({ "view-enter": viewEntersAnim })}>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <form
              className="form-horizontal"
              noValidate>
              <fieldset>
                <legend>
                  Login
                </legend>
                <div className="form-group">
                  <label
                    htmlFor="inputEmail"
                    className="col-lg-2 control-label">
                    Username
                  </label>
                  <div className="col-lg-10">
                    <input
                      type="text"
                      className="form-control"
                      id="inputEmail"
                      placeholder="Email"
                      value={name}
                      onChange={this.handlesOnUsernameChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="inputPassword"
                    className="col-lg-2 control-label">
                    Password
                  </label>
                  <div className="col-lg-10">
                    <input
                      type="password"
                      className="form-control"
                      id="inputPassword"
                      placeholder="Password"
                      value={birthYear}
                      onChange={this.handlesOnPasswordChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-lg-10 col-lg-offset-2">
                    <Link
                      className="btn btn-default"
                      to={'/'}>
                      Cancel
                    </Link>
                    <button
                      className="btn btn-primary login-button"
                      onClick={this.handlesOnLogin}>
                      Login
                    </button>
                  </div>
                </div>
              </fieldset>
            </form>
            <ErrorAlert
              showAlert={!!error}
              errorTitle={'Error'}
              errorMessage={error ? error.message : ''}
              onClose={this.closeError}
            />
          </div>
        </div>
      </div>
    );
  }

  handlesOnUsernameChange = (event) => {
    event.preventDefault();
    // should add some validator before setState in real use cases
    this.setState({ name: event.target.value });
  }

  handlesOnPasswordChange = (event) => {
    event.preventDefault();
    // should add some validator before setState in real use cases
    this.setState({ birthYear: event.target.value });
  }

  handlesOnLogin = async (event) => {
    event.preventDefault();
    const {
      loginUser,
      history,
      setTempUser
    } = this.props;

    const {
      name,
      birthYear
    } = this.state;

    setTempUser({name,birthYear});

    try {
      await loginUser({name});
      history.push({ pathname: '/protected' });
    } catch (error) {
      console.log('login went wrong..., error: ', error);
    }
  }

  closeError = (event) => {
    event.preventDefault();
    const { resetError } = this.props;
    resetError();
  }
}

export default Login;
