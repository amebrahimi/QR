import {combineReducers} from 'redux';
import userReducer from './userReducer'
import errorReducer from "./errorReducer";
import qrReducer from "./qrReducer";


export default combineReducers({
    auth: userReducer,
    errors: errorReducer,
    qrs: qrReducer
});
