import { useState } from "react";
import { Note } from "./types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NOTES_QK } from "../client/constant";

const useNotes = (groupId: number) => {
  const client = useQueryClient();
  const qKey = [NOTES_QK, groupId];

  const { data: notes } = useQuery({
    queryKey: qKey,
    placeholderData: [],
    staleTime: Infinity,
    networkMode: "offlineFirst",
    queryFn: () => client.getQueryData<Note[]>(qKey) || [],
    select: (notes) => notes.sort((a, b) => b.date - a.date),
  });

  const [inputValue, setInputValue] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editing, setEditing] = useState<boolean>(false);

  const handleSaveNote = () => {
    const note = {
      id: new Date().getTime(),
      note: inputValue,
      date: new Date().getTime(),
    };
    client.setQueryData<Note[]>(qKey, (prev) => [note, ...(prev || [])]);
    setInputValue("");
  };

  const handleDeleteNote = (id: number) => {
    client.setQueryData<Note[]>(qKey, (notes) =>
      notes?.filter((n) => n.id !== id)
    );
    if (selectedNote?.id === id) {
      setInputValue("");
      setSelectedNote(null);
    }
  };

  const handleSelectNote = (id: number) => {
    const note = notes?.find((n) => n.id === id);
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
      client.setQueryData<Note[]>(qKey, (notes) =>
        notes?.map((note) => {
          if (note.id === selectedNote.id) {
            return {
              ...selectedNote,
              note: inputValue,
              date: new Date().getTime(),
            };
          }
          return note;
        })
      );
      setEditing(false);
      handleClearViewMode();
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

export default useNotes;
