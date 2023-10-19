import { ChangeEventHandler, ReactNode, useRef, useState } from "react";
import NoteForm from "./NoteForm";
import NotesList from "./NotesList";
import style from "./notes.module.css";
import useNotes from "./useNotes";
import Alert from "../shared/Alert";

type NoteProps = {
  groupId: number;
};

export const NoteCard = ({ children }: { children: ReactNode }) => {
  return (
    <section className="card">
      <div className={style.content}>
        <div className={style.titleSection}>
          <h4> Notes </h4>
        </div>
        {children}
      </div>
    </section>
  );
};

function Note({ groupId }: NoteProps) {
  const {
    notes,
    inputValue,
    editing,
    selectedNote,
    setInputValue,
    handleSaveNote,
    handleEditNote,
    handleDeleteNote,
    handleSelectNote,
    handleClearViewMode,
    handleUpdateNote,
    handleCancelEditMode,
  } = useNotes(groupId);

  const [showUnsavedAlert, setShowUnsavedAlert] = useState(false);

  const confirmAction = useRef<() => void>();

  const handleWriteNote: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setInputValue(e.target.value);
  };

  const onSelectNote = (id: number) => {
    if (inputValue && !selectedNote) {
      setShowUnsavedAlert(true);
      confirmAction.current = () => {
        handleSelectNote(id);
        setShowUnsavedAlert(false);
      };
      return;
    }
    handleSelectNote(id);
  };

  return (
    <div className={style.mainSection}>
      <div className={style.noteColumn}>
        <NotesList
          notes={notes || []}
          disabled={editing}
          selectedNoteId={selectedNote?.id}
          onDeleteNote={handleDeleteNote}
          onSelectNote={onSelectNote}
        />
      </div>
      <NoteForm
        value={inputValue}
        onChange={handleWriteNote}
        onSaveNote={handleSaveNote}
        viewMode={!!selectedNote && !editing}
        editMode={!!selectedNote && editing}
        clearViewMode={handleClearViewMode}
        onEnterEditMode={handleEditNote}
        onUpdateNote={handleUpdateNote}
        onCancelEditMode={handleCancelEditMode}
      />
      {showUnsavedAlert && (
        <Alert
          message="You may lose some unsaved changes"
          confirmText="Continue"
          onConfirm={confirmAction.current}
          onClose={() => setShowUnsavedAlert(false)}
        />
      )}
    </div>
  );
}

export default Note;
