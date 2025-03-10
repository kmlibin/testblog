import React from "react";
import styles from "./modal.module.css";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: any;
}
const Modal = ({ show, onClose, children }: ModalProps) => {
  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {children}
        <button className={styles.okButton} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default Modal;
