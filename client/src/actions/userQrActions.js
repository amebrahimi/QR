import axios from 'axios';
import {GET_ERRORS, GET_OFF_CODE_TYPE, SEND_QR_USER} from "./types";
import {clearErrors} from "./qrActions";

export const submitQrUser = (userInfo, history) => dispatch => {

    axios.post('/api/user', userInfo)
        .then(res => {
                history.push('/submit');
                dispatch(clearErrors());
                dispatch({
                    type: SEND_QR_USER
                })

            }
        )
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }))

};

export const useOffCode = offCode => dispatch => {

    axios.post('api/user/use', offCode)
        .then(res => {
            dispatch(clearErrors());
            dispatch({
                type: GET_OFF_CODE_TYPE,
                payload: res.data
            })

        }).catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.response.data
    }))

};

