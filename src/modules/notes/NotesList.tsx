import style from "./notes.module.css";
import { ReactComponent as DeleteIcon } from "../../assets/icons/trash.svg";
import { cn } from "../../utils/helper";
import { Note } from "./types";
import { Fragment } from "react";
import { ReactComponent as NotesIcon } from "./icons/notes.svg";
import { formatToTimezoneString } from "../../utils/time";

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  disabled: boolean;
  onSelectNote: (id: number) => void;
  onDeleteNote: (id: number) => void;
}

export const NoteItem = ({
  note,
  isSelected,
  onSelectNote,
  onDeleteNote,
  disabled,
}: NoteItemProps) => {
  const noteTitle = note.note.trim().split(/\n|\r\n?/)[0];

  const formattedDate = formatToTimezoneString(new Date(note.date), "");

  return (
    <div className={cn(style.noteItemWrap, disabled ? style.disabled : "")}>
      <div
        onClick={() => onSelectNote(note.id)}
        className={cn(style.noteItem, isSelected ? style.selected : "")}
      >
        <p className={style.noteTitle}> {noteTitle}</p>
        <p className={style.noteTime}>{formattedDate}</p>
      </div>
      <button
        onClick={() => onDeleteNote(note.id)}
        className={cn("icon-button", style.deleteButton)}
      >
        <DeleteIcon />
      </button>
    </div>
  );
};

interface NotesListProps {
  notes: Note[];
  selectedNoteId?: number;
  disabled: boolean;
  onSelectNote: (id: number) => void;
  onDeleteNote: (id: number) => void;
}

function NotesList({
  notes,
  disabled,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
}: NotesListProps) {
  return (
    <div className={style.noteList}>
      {notes.length > 0 ? (
        notes.map((note, index) => (
          <Fragment key={note.id}>
            {index !== 0 && <div className="divider" />}
            <NoteItem
              note={note}
              disabled={disabled}
              isSelected={selectedNoteId === note.id}
              onSelectNote={onSelectNote}
              onDeleteNote={onDeleteNote}
            />
          </Fragment>
        ))
      ) : (
        <div className={style.noNotes}>
          <span>
            <NotesIcon />
            <p>Your saved notes will appear here.</p>
          </span>
        </div>
      )}
    </div>
  );
}

export default NotesList;