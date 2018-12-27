import {HIDE_NAVBAR, SHOW_NAVBAR} from "../actions/types";

const initialState = {
    is_navbar_visible: true
};

export default function (state = initialState, payload) {
    switch (payload.type) {
        case HIDE_NAVBAR:
            return {
                ...state,
                is_navbar_visible: false
            };

        case SHOW_NAVBAR:
            return {
                ...state,
                is_navbar_visible: true
            };

        default:
            return state;
    }
}