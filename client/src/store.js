import {createStore, applyMiddleware} from 'redux';
// import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
// import {createLogger} from 'redux-logger';

// const logger = createLogger({
//     collapsed: true,
//     diff: true
// });
//
// const initialState = {};
// const middleware = [thunk, logger];
//
// const store = createStore(rootReducer, initialState, composeWithDevTools(
//     applyMiddleware(...middleware)
// ));

const initialState = {};

const middleware = [thunk];


const store = createStore(rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);


export default store;
