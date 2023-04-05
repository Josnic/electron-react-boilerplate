import { configureStore } from '@reduxjs/toolkit';

import AuthReducer from './reducers';

export default configureStore({ reducer: {
    auth: AuthReducer
}})