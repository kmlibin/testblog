import React from "react";
import styles from './dsbuttons.module.css'
import { MdUpload } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";

type Props = {
    loading: boolean;
    setDraft: React.Dispatch<React.SetStateAction<boolean>>
    type: string;
};

const DraftSaveButtons = ({loading, setDraft, type}: Props) => {
  return (
    <div className={styles.buttons}>
    <button type="submit" className={styles.publish} disabled={loading}>
      {type==="create" ? "Create Post" : "Publish Changes"}
      <MdUpload />
    </button>
    <button
      type="submit"
      disabled={loading}
      onClick={() => setDraft(true)}
      className={styles.draft}
    >
      Save as Draft
      <FaRegSave />
    </button>
  </div>
  );
};

export default DraftSaveButtons;
