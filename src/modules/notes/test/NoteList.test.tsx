import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import NotesList, { NoteItem } from "../NotesList";

describe("NoteItem Component", () => {
  const note = {
    id: 1,
    note: "Test Note",
    date: new Date("2023-07-18T12:00:00").getTime(),
  };

  it("should render NoteItem correctly", () => {
    render(
      <NoteItem
        note={note}
        isSelected={false}
        disabled={false}
        onSelectNote={vi.fn()}
        onDeleteNote={vi.fn()}
      />
    );

    const noteTitleElement = screen.getByText("Test Note");
    expect(noteTitleElement).toBeInTheDocument();
  });
});

describe("NotesList Component", () => {
  const notes = [
    { id: 1, note: "Note 1", date: new Date("2023-07-18T12:00:00").getTime() },
    { id: 2, note: "Note 2", date: new Date("2023-07-18T13:00:00").getTime() },
  ];

  it("should render NotesList correctly", () => {
    render(
      <NotesList
        notes={notes}
        selectedNoteId={1}
        disabled={false}
        onSelectNote={vi.fn()}
        onDeleteNote={vi.fn()}
      />
    );

    const note1Element = screen.getByText("Note 1");
    const note2Element = screen.getByText("Note 2");
    expect(note1Element).toBeInTheDocument();
    expect(note2Element).toBeInTheDocument();
  });

  it('should show "No Notes" message when notes array is empty', () => {
    render(
      <NotesList
        notes={[]}
        disabled={false}
        onSelectNote={vi.fn()}
        onDeleteNote={vi.fn()}
      />
    );

    const noNotesElement = screen.getByText(
      "Your saved notes will appear here."
    );
    expect(noNotesElement).toBeInTheDocument();
  });
});
