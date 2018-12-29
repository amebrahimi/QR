import {GET_ALL_THE_QR_FOR_TABLE, GET_ALL_THE_USERS_FOR_TABLE, QR_LOADING_FALSE} from "../actions/types";

const initialState = {
    qr_is_loading: false,
    qrList: [],
    userList: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ALL_THE_QR_FOR_TABLE:
            return {
                ...state,
                qr_is_loading: false,
                qrList: action.payload
            };

        case GET_ALL_THE_USERS_FOR_TABLE:
            return {
                ...state,
                qr_is_loading: false,
                userList: action.payload
            };

        case QR_LOADING_FALSE: {
            return {
                ...state,
                is_loading: false
            }
        }

        default:
            return state;
    }
}