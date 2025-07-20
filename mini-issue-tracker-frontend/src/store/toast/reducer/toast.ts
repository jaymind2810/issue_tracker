import { ToastActionType } from "../action-type";
import { Action } from "../action/actions";

export interface toast {
  toast: boolean;
  message: string;
}

export const INITIAL_STATE = {
  toast: null,
};

const toastReducer = (state = INITIAL_STATE, action: Action) => {
  const { payload, type } = action;
  switch (type) {
    case ToastActionType.SUCCESS:
      return {
        ...state,
        toast: { type: "SUCCESS", ...payload },
      };
    case ToastActionType.CLOSE:
      return {
        ...state,
        toast: payload,
      };
    case ToastActionType.WARNING:
      return {
        ...state,
        toast: { type: "WARNING", ...payload },
      };
    case ToastActionType.ERROR:
      return {
        ...state,
        toast: payload,
      };
    default:
      return state;
  }
};

export default toastReducer;
