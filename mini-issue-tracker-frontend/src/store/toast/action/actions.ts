import { ToastActionType } from "../action-type";
import { toast } from "../reducer/toast";

interface ToastSuccessAction {
  type: ToastActionType.SUCCESS;
  payload: toast
}

interface ToastWarningAction {
  type: ToastActionType.WARNING;
  payload: toast
}

interface ToastErrorAction {
  type: ToastActionType.ERROR;
  payload: toast
}

interface ToastClose {
  type: ToastActionType.CLOSE;
  payload: []
}

export type Action =
  | ToastSuccessAction
  | ToastClose
  | ToastWarningAction
  | ToastErrorAction;