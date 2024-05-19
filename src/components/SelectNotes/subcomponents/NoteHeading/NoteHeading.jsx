import React, { useContext } from "react";
import styles from "../../selectednotes.module.css";
import AppContext from "../../../../context/AppContext";
import { AiOutlineDelete } from "react-icons/ai";
function NoteHeading({ noteHeading }) {
  const { isMobile, setHide, setCurrentGroup, deleteGroup, currentGroup } =
    useContext(AppContext);
  const { letters } = noteHeading;

  const handleClick = () => {
    setCurrentGroup(noteHeading);
    if (isMobile) {
      setHide(true);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteGroup(noteHeading);
    if (currentGroup === noteHeading) {
      setCurrentGroup("");
    }
    console.log("group deleted", noteHeading);
  };

  return (
    <div
      onClick={handleClick}
      className={`${styles.groupName} `}
      key={noteHeading?.name}
    >
      <div
        className={styles.icon}
        style={{ backgroundColor: noteHeading?.color }}
      >
        {noteHeading.name && letters}
      </div>
      <div>{noteHeading.name}</div>
      <div className={styles.deleteButton} onClick={handleDelete}>
        <AiOutlineDelete size="1.25rem" />
      </div>
    </div>
  );
}

export default NoteHeading;
