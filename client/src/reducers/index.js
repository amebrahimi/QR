import {combineReducers} from 'redux';
import userReducer from './userReducer'
import errorReducer from "./errorReducer";
import qrReducer from "./qrReducer";
import userQrReducer from "./userQrReducer";
import navbarReducer from "./navbarReducer";
import queryReducer from "./queryReducer";


export default combineReducers({
    auth: userReducer,
    errors: errorReducer,
    qrs: qrReducer,
    userQr: userQrReducer,
    navbar: navbarReducer,
    table: queryReducer
});
