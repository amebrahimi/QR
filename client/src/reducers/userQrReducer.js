import {SEND_QR_USER} from "../actions/types";

const initialState = {
    successful: false
};

export default function (state = initialState, action) {

    switch (action.type) {

        case SEND_QR_USER:
            return {
                ...state,
                successful: true
            };

        default:
            return state;
    }
}
