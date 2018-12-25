import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import AppNavbar from "./components/layout/Navbar";
import Login from "./components/login/Login";
import jwt_decode from 'jwt-decode';
import {Provider} from 'react-redux';

import store from './store';
import {logoutUser, setCurrentUser} from "./actions/authActions";
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./components/common/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Statistics from "./components/dashboard/Statistics";
import Scan from "./components/scan/Scan";
import Success from "./components/scan/Success";
import './App.css';


if (localStorage.jwtToken) {
    // Set auth token header auth
    setAuthToken(localStorage.jwtToken);
    // Decode Token and get user info and exp
    const decoded = jwt_decode(localStorage.jwtToken);

    // Set User and isAuthenticated
    store.dispatch(setCurrentUser(decoded));

    // Check for expired token
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser());

        // Redirect to login
        window.location.href = '/login';
    }
}

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <AppNavbar/>
                        <Route exact path="/" component={Login}/>
                        <Route exact path="/scan" component={Scan}/>
                        <Route exact path="/submit" component={Success}/>
                        <Switch>
                            <PrivateRoute exact path="/dashboard" component={Dashboard}/>
                            <PrivateRoute exact path="/dashboard/statistics" component={Statistics}/>
                        </Switch>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
