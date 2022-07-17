import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {

    /**
     * Challenge: When the user edits a note, reposition
     * it in the list of notes to the top of the list
     */

    const [notes, setNotes] = React.useState(() => JSON.parse(localStorage.getItem("notes")) || [])
    
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )

    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    // Update the current note and add it to the top of the notes list
    function updateNote(text) {
        setNotes(oldNotes => {
            const updatedNotes = []
            for (const oldNote of oldNotes) {
                if (oldNote.id === currentNoteId) {
                    /* Update the current note's body text stored in the 
                    notes state array and add the note to the top of the 
                    notes state array */
                    updatedNotes.unshift({ ...oldNote, body: text })
                } else {
                    updatedNotes.push(oldNote)
                }
            }
            return updatedNotes
        })
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }

    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}