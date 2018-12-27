import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from "../utils/setAuthToken";
import {GET_ERRORS, HIDE_NAVBAR, SET_CURRENT_USER, SHOW_NAVBAR} from "./types";

export const loginUser = userData => dispatch => {
    axios.post('/api/admin/login', userData)
        .then(res => {
            const {token} = res.data;

            localStorage.setItem('jwtToken', token);

            setAuthToken(token);

            const decode = jwt_decode(token);

            dispatch(setCurrentUser(decode));
        }).catch(
        err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
};

export const hideNavbar = () => dispatch => {
    return dispatch({
        type: HIDE_NAVBAR
    });
};

export const showNavbar = () => dispatch => {
    return dispatch({
        type: SHOW_NAVBAR
    });
};

export const setCurrentUser = decode => {
    return {
        type: SET_CURRENT_USER,
        payload: decode
    }
};

export const logoutUser = () => dispatch => {
    // Remove token from localStorage
    localStorage.removeItem('jwtToken');

    // Remove auth header for future request
    setAuthToken(false);

    // Set the current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};
