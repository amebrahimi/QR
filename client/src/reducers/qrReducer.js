import {
    GET_OFF_CODE_TYPE,
    GET_QR_TYPES,
    QR_GENERATED,
    QR_LOADING,
    QR_LOADING_FALSE,
    QR_OFF_CODE_GENERATED
} from "../actions/types";

const initialState = {
    types: [],
    qr_data: {},
    off_data: {},
    success: false,
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {

        case QR_LOADING:
            return {
                ...state,
                loading: true
            };

        case QR_LOADING_FALSE:
            return {
                ...state,
                loading: false
            };

        case GET_QR_TYPES:
            return {
                ...state,
                types: action.payload.types,
                loading: false
            };

        case QR_OFF_CODE_GENERATED:
            return {
                ...state,
                qr_data: action.payload,
                loading: false
            };

        case QR_GENERATED:
            return {
                ...state,
                success: true,
                loading: false
            };

        case GET_OFF_CODE_TYPE:
            return {
                ...state,
                loading: false,
                off_data: action.payload
            };

        default:
            return state;
    }
}
