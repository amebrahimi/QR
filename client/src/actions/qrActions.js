import axios from 'axios';
import {
    CLEAR_ERRORS,
    GET_ERRORS,
    GET_QR_TYPES,
    QR_GENERATED,
    QR_LOADING,
    QR_LOADING_FALSE,
    QR_OFF_CODE_GENERATED
} from "./types";

export const getQrTypes = () => dispatch => {
    dispatch(setPostLoading());
    axios.get('/api/qr')
        .then(res => {

            dispatch({
                type: GET_QR_TYPES,
                payload: res.data
            })

        }).catch(
        err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    )
};

export const generateQr = postData => dispatch => {
    dispatch(clearErrors());
    dispatch(setPostLoading());
    axios.post('/api/qr/generate', postData)
        .then(res => dispatch({
            type: QR_GENERATED,
            payload: res.data
        }))
        .catch(err => {
                dispatch(setQrLoadingFalse());
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            }
        )
};

export const generateOffCode = code => dispatch => {
    dispatch(setPostLoading());
    axios.get(`/api/qr/generate_off?code=${code}`)
        .then(res => dispatch({
            type: QR_OFF_CODE_GENERATED,
            payload: res.data
        }))
        .catch(err => {
            dispatch(setQrLoadingFalse());
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })

};


export const setPostLoading = () => {
    return {
        type: QR_LOADING
    }
};

export const setQrLoadingFalse = () => {
    return {
        type: QR_LOADING_FALSE
    }
};

export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
    }
};
