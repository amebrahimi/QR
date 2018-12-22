import {GET_QR_TYPES, QR_GENERATED, QR_LOADING, QR_LOADING_FALSE, QR_OFF_CODE_GENERATED} from "../actions/types";

const initialState = {
    types: [],
    qr_data: {},
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
                qr_data: action.payload
            };

        case QR_GENERATED:
            return {
                ...state,
                success: true,
                loading: false
            };

        default:
            return state;
    }
}
