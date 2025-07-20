import { combineReducers } from "redux";

// import loaderReducer from "./loader/reducer/reducer";
// import userReducer from "./user/reducer/reducer";
import toastReducer from "./toast/reducer/toast";
// import cartReducer from "./cart/reducer/reducer";
// import addressReducer from "./address/reducer/reducer";
// import orderReducer from "./order/reducer/reducer";

const reducers = combineReducers({
  // user: userReducer,
  toast: toastReducer,
  // loader: loaderReducer,
  // address: addressReducer,
  // cart: cartReducer,
  // order: orderReducer,
});
export default reducers;
export type State = ReturnType<typeof reducers>;
