import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import {
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { notesCollection, db } from "./firebase";

export default function App() {
  const [notes, setNotes] = React.useState([]);

  const [currentNoteId, setCurrentNoteId] = React.useState("");

  const [tempNoteText, setTempNoteText] = React.useState("");

  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0];

  // Sort notes from most-recently-updated to least-recently-updated
  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      // Sync up the local notes array with the snapshot data
      const notesArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesArray);
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    if (!currentNoteId) setCurrentNoteId(notes[0]?.id);
  }, [notes]);

  React.useEffect(() => {
    setTempNoteText(currentNote?.body || "");
  }, [currentNote]);

  React.useEffect(() => {
    // Debouncing
    const timeoutId = setTimeout(async () => {
      if (tempNoteText !== currentNote.body) await updateNote(tempNoteText);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [tempNoteText]);

  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
  }

  // Update the current note and add it to the top of the notes list
  async function updateNote(text) {
    const docRef = doc(db, "notes", currentNoteId);
    /*
    Note:
    =====
      Both setDoc and updateDoc can achieve what we want here 
      (updating the note's body) but with the following differences:

      - We need to pass { merge: true } to setDoc to avoid overwriting other data
        (in case if the note object has properties other than the "body").

      - updateDoc needs to write to an existing doc (referred to by the docRef) 
        otherwise it will fail but setDoc will create the doc if it doesn't exist.
    */

    //await setDoc(docRef, { body: text }, { merge: true });
    await updateDoc(docRef, { body: text, updatedAt: Date.now() });
  }

  async function deleteNote(noteId) {
    const docRef = doc(db, "notes", noteId);
    await deleteDoc(docRef);
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />

          <Editor
            tempNoteText={tempNoteText}
            setTempNoteText={setTempNoteText}
          />
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
