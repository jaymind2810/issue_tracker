import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// import { closeToast } from "../../../store/toast/actions-creation";
import successIcon from "../../images/success-icon.svg";
import warningIcon from "../../images/warning-icon.svg";
import errorIcon from "../../images/error-icon.svg";
import { closeToast } from "../../store/toast/actions-creation";

const Toast = () => {
  const dispatch = useDispatch();
  const toastlist = useSelector((state: any) => state.toast);

  const [showToast, setShowToast] = useState(true);
  const [type, setType] = useState("");

  useEffect(() => {
    setShowToast(!showToast);
    if (toastlist["toast"]) {
      setType(toastlist["toast"]["type"]);
    }
  }, [toastlist]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [showToast]);

  const deleteToast = () => {
    dispatch(closeToast([]));
  };

  return showToast ? (
    <div
      className={`enable toast-wrap fixed top-5 right-5 z-[5999] ${
        showToast && "enable"
      }`}
    >
      <div
        className={`${
          type === "SUCCESS"
            ? "bg-[#eaf7ee] text-[#3fb45f] z-[99] rounded-md border-0 w-auto left-auto right-auto mx-auto p-4 inline-flex mb-[50px] relative"
            : type === "WARNING"
            ? "bg-[#fef7ea] text-[#ee9500] z-[99] rounded-md border-0 w-auto left-auto right-auto mx-auto p-4 inline-flex mb-[50px] relative"
            : "bg-[#fcede9] text-[#e94f2c] z-[99] rounded-md border-0 w-auto left-auto right-auto mx-auto p-4 inline-flex mb-[50px] relative"
        } modal-content`}
      >
        {type === "SUCCESS" ? (
          <div
            className="toast-icon success order-1 flex"
            onClick={() => deleteToast()}
          >
            <img className="w-5 mr-2" src={successIcon} alt=""></img>
          </div>
        ) : type === "WARNING" ? (
          <div
            className="toast-icon warning order-1 flex"
            onClick={() => deleteToast()}
          >
            <img className="w-5 mr-2" src={warningIcon} alt=""></img>
          </div>
        ) : (
          <div
            className="toast-icon error order-1 flex"
            onClick={() => deleteToast()}
          >
            <img className="w-5 mr-2" src={errorIcon} alt=""></img>
          </div>
        )}
        <div className="text-left text-sm order-2">
          {toastlist["toast"] ? toastlist["toast"]["message"] : "somthing"}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Toast;
