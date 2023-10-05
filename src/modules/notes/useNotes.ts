import { useState } from "react";
import {
  deleteNote,
  getGroupSavedNotes,
  replaceGroupNotes,
  saveNote,
} from "./functions";
import { Note } from "./types";

const useCityNotes = (groupId: number) => {
  const savedNotes = getGroupSavedNotes(groupId);
  const [notes, setNotes] = useState<Note[]>(savedNotes || []);
  const [inputValue, setInputValue] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editing, setEditing] = useState<boolean>(false);

  const handleSaveNote = () => {
    const note = {
      id: new Date().getTime(),
      note: inputValue,
      date: new Date().getTime(),
    };
    saveNote(groupId, note);
    setNotes((prev) => [note, ...prev]);
    setInputValue("");
  };

  const handleDeleteNote = (id: number) => {
    const notes = deleteNote(groupId, id);
    setNotes(notes);
    if (selectedNote?.id === id) {
      setInputValue("");
      setSelectedNote(null);
    }
  };

  const handleSelectNote = (id: number) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      setSelectedNote(note);
      setInputValue(note.note);
    }
  };

  const handleClearViewMode = () => {
    setSelectedNote(null);
    setInputValue("");
  };

  const handleEditNote = () => {
    if (selectedNote) {
      setEditing(true);
    }
  };

  const handleUpdateNote = () => {
    if (selectedNote) {
      const updatedNote = {
        ...selectedNote,
        note: inputValue,
        date: new Date().getTime(),
      };

      const otherNotes = notes.filter((n) => n.id !== updatedNote.id);
      const allNotes = [updatedNote, ...otherNotes];
      replaceGroupNotes(groupId, allNotes);
      setNotes(allNotes);
      setEditing(false);
      handleClearViewMode()
    }
  };

  const handleCancelEditMode = () => {
    if (selectedNote) {
      setInputValue(selectedNote.note);
      setEditing(false);
    }
  };

  return {
    notes,
    editing,
    inputValue,
    selectedNote,
    setInputValue,
    setNotes,
    setEditing,
    handleSaveNote,
    handleEditNote,
    handleDeleteNote,
    handleSelectNote,
    handleUpdateNote,
    handleClearViewMode,
    handleCancelEditMode,
  };
};

export default useCityNotes;
