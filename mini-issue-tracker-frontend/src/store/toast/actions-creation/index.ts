import { ToastActionType } from "../action-type";
import { toast } from "../reducer/toast";

export const successToast = (toast: toast) => {
  return {
    type: ToastActionType.SUCCESS,
    payload: toast,
  };
};

export const warningToast = (toast: toast) => {
  return {
    type: ToastActionType.WARNING,
    payload: toast,
  };
};

export const errorToast = (toast: toast) => {
  return {
    type: ToastActionType.ERROR,
    payload: toast,
  };
};

export const closeToast = (toast: []) => {
  return {
    type: ToastActionType.SUCCESS,
    payload: toast,
  };
};
