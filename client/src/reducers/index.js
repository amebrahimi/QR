import {combineReducers} from 'redux';
import userReducer from './userReducer'
import errorReducer from "./errorReducer";
import qrReducer from "./qrReducer";
import userQrReducer from "./userQrReducer";
import navbarReducer from "./navbarReducer";


export default combineReducers({
    auth: userReducer,
    errors: errorReducer,
    qrs: qrReducer,
    userQr: userQrReducer,
    navbar: navbarReducer,
});
