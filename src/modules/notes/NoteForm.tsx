import { ChangeEventHandler } from "react";
import { cn } from "../../utils/helper";
import style from "./notes.module.css";

interface NoteFormProps {
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onSaveNote: () => void;
  viewMode: boolean;
  editMode: boolean;
  clearViewMode: () => void;
  onEnterEditMode: () => void;
  onUpdateNote: () => void;
  onCancelEditMode: () => void;
}

function NoteForm({
  value,
  viewMode,
  editMode,
  onChange,
  onSaveNote,
  clearViewMode,
  onEnterEditMode,
  onUpdateNote,
  onCancelEditMode,
}: NoteFormProps) {
  return (
    <div className={cn("stack-space-2", style.noteFormContainer)}>
      <textarea
        disabled={viewMode}
        value={value}
        onChange={onChange}
        placeholder="Enter Your Note Here"
      />
      <div className={style.formActions}>
        {!editMode && !viewMode && (
          <button
            disabled={!value}
            onClick={onSaveNote}
            className="button primary"
          >
            Save Note
          </button>
        )}

        {editMode && (
          <>
            <button
              disabled={!value}
              onClick={onUpdateNote}
              className="button amber"
            >
              Update Note
            </button>
            <button onClick={onCancelEditMode} className="button primary outline">
              Cancel Edit
            </button>
          </>
        )}

        {viewMode && (
          <>
            <button onClick={onEnterEditMode} className="button primary">
              Edit Note
            </button>
            <button onClick={clearViewMode} className="button primary outline">
              Add New Note
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default NoteForm;
