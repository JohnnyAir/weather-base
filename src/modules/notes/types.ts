export interface Note {
  id: number;
  note: string;
  date: number;
}

export interface GroupSavedNotes {
  [id: number]: Note[];
}
