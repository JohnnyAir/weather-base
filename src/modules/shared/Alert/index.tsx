import ReactDOM from "react-dom";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import style from "./alert.module.css";

interface AlertProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose: () => void;
}

const Alert = ({
  message,
  confirmText,
  cancelText,
  onConfirm,
  onClose,
}: AlertProps) => {
  const rootNode = document.getElementById("alert-root");
  if (!rootNode) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className={style.alertOverlay}>
      <div className={style.alert}>
        <span className={style.close} onClick={onClose}>
          <CloseIcon />
        </span>
        <p className={style.message}>{message}</p>
        <div className={style.actions}>
          {onConfirm && (
            <button onClick={onConfirm} className="button danger">
              {confirmText || "Continue"}
            </button>
          )}
          <button onClick={onClose} className="button primary outline">
            {cancelText || "Cancel"}
          </button>
        </div>
      </div>
    </div>,
    rootNode
  );
};

export default Alert;
