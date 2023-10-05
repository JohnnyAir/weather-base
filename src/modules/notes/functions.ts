import { GroupSavedNotes, Note } from "./types";

const savedNotesKey = "notes";

export function saveNote(groupId: number, note: Note): void {
  try {
    const savedNotesStr = localStorage.getItem(savedNotesKey) || "{}";
    let groupSavedNotes: GroupSavedNotes = {};

    if (groupSavedNotes) {
      groupSavedNotes = JSON.parse(savedNotesStr);
    }

    const groupNotes = groupSavedNotes[groupId] || [];

    const updatedNotes = {
      ...groupSavedNotes,
      [groupId]: [note, ...groupNotes],
    };
    localStorage.setItem(savedNotesKey, JSON.stringify(updatedNotes));
  } catch (error) {}
}

export function deleteNote(groupId: number, noteId: number): Note[] {
  try {
    const savedNotesStr = localStorage.getItem(savedNotesKey) || "{}";
    let groupSavedNotes: GroupSavedNotes = {};

    if (groupSavedNotes) {
      groupSavedNotes = JSON.parse(savedNotesStr);
    }

    let groupNotes = groupSavedNotes[groupId] || [];
    groupNotes = groupNotes.filter((n) => n.id !== noteId);

    const updatedNotes = {
      ...groupSavedNotes,
      [groupId]: groupNotes,
    };
    localStorage.setItem(savedNotesKey, JSON.stringify(updatedNotes));
    return groupNotes;
  } catch (error) {}
  return [];
}

export function replaceGroupNotes(groupId: number, notes: Note[]): void {
  try {
    const savedNotesStr = localStorage.getItem(savedNotesKey) || "{}";
    let groupSavedNotes: GroupSavedNotes = {};

    if (groupSavedNotes) {
      groupSavedNotes = JSON.parse(savedNotesStr);
    }

    const updatedNotes = {
      ...groupSavedNotes,
      [groupId]: notes,
    };
    localStorage.setItem(savedNotesKey, JSON.stringify(updatedNotes));
  } catch (error) {}
}

export function getGroupSavedNotes(groupId: number): Note[] | null {
  try {
    const savedNotesStr = localStorage.getItem(savedNotesKey);
    if (savedNotesStr) {
      const groupSavedNotes: GroupSavedNotes = JSON.parse(savedNotesStr);
      return groupSavedNotes[groupId];
    }
  } catch (error) {}
  return null;
}

export function groupHasNote(groupId: number) {
  const notes = getGroupSavedNotes(groupId);
  return notes ? notes.length > 0 : false;
}
