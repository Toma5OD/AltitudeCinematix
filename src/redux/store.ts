import { createStore } from 'redux';
import userReducer from './reducer';

export type RootState = ReturnType<typeof userReducer>;

const store = createStore(userReducer);

export default store;
