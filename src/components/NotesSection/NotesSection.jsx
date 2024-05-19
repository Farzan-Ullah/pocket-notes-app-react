import React, { useContext, useState, useEffect, useCallback } from "react";
import styles from "../NotesSection/NoteSection.module.css";
import AppContext from "../../context/AppContext";
import { IoMdArrowRoundBack } from "react-icons/io";
import { BiSolidSend } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { nanoid } from "nanoid";
import HomePage from "../HomePage/HomePage";

function NoteSection() {
  const {
    currentGroup,
    hide,
    setHide,
    isMobile,
    noteHeadings,
    setNoteHeadings,
  } = useContext(AppContext);
  const { name, color, letters } = currentGroup;
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState(currentGroup.notes);
  const [isFilled, setIsFilled] = useState(false);

  const addNote = useCallback(() => {
    const currentDate = new Date();
    const currentTime = currentDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const currentShowDate = currentDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const newNote = {
      id: nanoid(),
      time: currentTime,
      date: currentShowDate,
      note: noteText,
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);

    const updatedNoteHeadings = noteHeadings.map((noteHeading) =>
      noteHeading.name === name
        ? { ...noteHeading, notes: [...noteHeading.notes, newNote] }
        : noteHeading
    );
    setNoteHeadings(updatedNoteHeadings);
    setNoteText("");
    setIsFilled(false);
  }, [name, noteHeadings, noteText, setNoteHeadings]);

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);

    const updatedNoteHeadings = noteHeadings.map((noteHeading) =>
      noteHeading.name === name
        ? { ...noteHeading, notes: updatedNotes }
        : noteHeading
    );
    setNoteHeadings(updatedNoteHeadings);
  };

  useEffect(() => {
    setNotes(currentGroup.notes);
  }, [currentGroup.notes]);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(noteHeadings));
  }, [noteHeadings]);

  useEffect(() => {
    function handleKeyPress(e) {
      if (e.key === "Enter") {
        if (noteText.trim() !== "") {
          addNote();
        }
      }
    }
    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [addNote, noteText]);

  if (!currentGroup && !isMobile) {
    return <HomePage />;
  }


  return (
    <div
      className={`${styles.container} ${!hide && isMobile && styles.hidden}`}
    >
      <div className={styles.header}>
        {isMobile && (
          <div onClick={() => setHide(isMobile && false)}>
            <IoMdArrowRoundBack size="1.25rem" />
          </div>
        )}
        <div>
          <div className={styles.icon} style={{ backgroundColor: color }}>
            {letters}
          </div>

          <div>{name}</div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.notes}>
          {notes &&
            notes.map((note) => {
              return (
                <div className={styles.note} key={nanoid()}>
                  <div className={styles.dateTime}>
                    <div className={styles.time}>{note.time}</div>
                    <div className={styles.date}>{note.date}</div>
                  </div>
                  <div className={styles.noteContent}>{note.note}</div>
                  <div
                    className={styles.deleteButton}
                    onClick={() => deleteNote(note.id)}
                  >
                    <AiOutlineDelete size="1.25rem" />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className={styles.input}>
        <textarea
          cols="10"
          rows="10"
          placeholder="Enter your text here"
          value={noteText}
          onChange={(e) => {
            // if (e.target.value.trim() !== "") {
            const text = e.target.value;
            setNoteText(text);
            setIsFilled(text.trim() !== "");
            // }
          }}
        ></textarea>
        <div
          onClick={isFilled ? addNote : null}
          style={{
            opacity: isFilled ? 1 : 0.5,
            cursor: "pointer",
          }}
        >
          <BiSolidSend
            style={{ color: isFilled ? "#000" : "#ABABAB" }}
            size="1.25rem"
          />
        </div>
      </div>
    </div>
  );
}

export default NoteSection;
