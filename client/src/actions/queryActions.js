import axios from 'axios';
import {GET_ALL_THE_QR_FOR_TABLE, GET_ALL_THE_USERS_FOR_TABLE, GET_ERRORS} from "./types";
import {setPostLoading} from "./qrActions";

export const getQrListForTable = () => dispatch => {

    axios.get('/api/query/qr')
        .then(res => {
            dispatch(setPostLoading());
            dispatch({
                type: GET_ALL_THE_QR_FOR_TABLE,
                payload: res.data
            })
        }).catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.response.data
    }))
};

export const getUserListForTable = () => dispatch => {

    axios.get('/api/query/user')
        .then(res => {
            dispatch(setPostLoading());
            dispatch({
                type: GET_ALL_THE_USERS_FOR_TABLE,
                payload: res.data
            })
        }).catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.response.data
    }))
};
