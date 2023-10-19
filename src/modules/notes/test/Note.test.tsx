import { QueryClient } from "@tanstack/react-query";
import { renderWithQueryClient } from "../../../../tests/utils";
import Note from "../index";
import { NOTES_QK } from "../../../client/constant";
import { within } from "@testing-library/react";

describe("<Note /> Component", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: Infinity,
        retry: false,
      },
    },
  });

  const placeOneId = 1;
  const newNoteText = "This is a note.";

  const placeTwoId = 2;
  const savedNotes = [
    {
      id: 16,
      note: "Note 1",
      date: new Date().getTime(),
    },
    {
      id: 22,
      note: "Note 2",
      date: new Date().getTime(),
    },
  ];
  const note2UpdateText = "Updated note 2";

  it("should correctly add new note", async () => {
    const { user, findByRole, getByRole } = renderWithQueryClient(
      queryClient,
      <Note groupId={placeOneId} />
    );

    const textBox = getByRole("textbox");
    const saveBtn = getByRole("button", { name: /Save/i });

    await user.type(textBox, newNoteText);

    expect(textBox).toHaveValue(newNoteText);
    expect(saveBtn).not.toBeDisabled();

    await user.click(saveBtn);

    const noteItem = await findByRole("listitem");

    expect(noteItem).toHaveTextContent(newNoteText);
  });

  it("should load saved notes", async () => {
    queryClient.setQueryData([NOTES_QK, placeTwoId], savedNotes);

    const { findAllByRole } = renderWithQueryClient(
      queryClient,
      <Note groupId={placeTwoId} />
    );

    const noteItems = await findAllByRole("listitem");
    expect(noteItems.length).toBe(2);
    expect(noteItems[0]).toHaveTextContent(savedNotes[0].note);
  });

  it("should preview selected note", async () => {
    const { user, findByRole, getByRole } = renderWithQueryClient(
      queryClient,
      <Note groupId={placeOneId} />
    );

    const noteItem = await findByRole("listitem");

    await user.click(noteItem);

    const textBox = getByRole("textbox");

    expect(textBox).toHaveValue(newNoteText);
    expect(textBox).toBeDisabled();
  });

  it("should correctly clear preview mode.", async () => {
    const { user, ...screen } = renderWithQueryClient(
      queryClient,
      <Note groupId={placeOneId} />
    );

    const noteItem = await screen.findByRole("listitem");

    const textBox = screen.getByRole("textbox");

    await user.click(noteItem);

    // const editNoteBtn = await screen.findByRole("button", { name: /edit/i });

    const clearPreviewModeBtn = await screen.findByRole("button", {
      name: /add new note/i,
    });

    expect(textBox).toHaveValue(newNoteText);
    expect(textBox).toBeDisabled();

    await user.click(clearPreviewModeBtn);

    expect(textBox).toHaveValue("");
    expect(textBox).toBeEnabled();
    expect(clearPreviewModeBtn).not.toBeInTheDocument();

    const saveBtn = await screen.findByRole("button", { name: /save/i });

    expect(saveBtn).toBeDisabled();
    expect(noteItem).toBeInTheDocument();
    expect(noteItem).toHaveTextContent(newNoteText);
  });

  it("should correctly clear edit mode.", async () => {
    const { user, ...screen } = renderWithQueryClient(
      queryClient,
      <Note groupId={placeOneId} />
    );

    const noteItem = await screen.findByRole("listitem");

    const textBox = screen.getByRole("textbox");

    await user.click(noteItem);

    const editNoteBtn = await screen.findByRole("button", { name: /edit/i });

    expect(textBox).toHaveValue(newNoteText);
    expect(textBox).toBeDisabled();

    await user.click(editNoteBtn);

    const cancelEditNoteBtn = await screen.findByRole("button", {
      name: /cancel edit/i,
    });

    expect(textBox).toBeEnabled();
    expect(textBox).toHaveValue(newNoteText);

    await user.click(cancelEditNoteBtn);

    expect(textBox).toHaveValue(newNoteText);
    expect(textBox).toBeDisabled();
    expect(cancelEditNoteBtn).not.toBeInTheDocument();
    expect(noteItem).toBeInTheDocument();
    expect(noteItem).toHaveTextContent(newNoteText);
  });

  it("should corectly update note and move to top of list", async () => {
    const { user, ...screen } = renderWithQueryClient(
      queryClient,
      <Note groupId={placeTwoId} />
    );

    const noteItems = await screen.findAllByRole("listitem");
    const textBox = screen.getByRole("textbox");

    const noteToUpdate = noteItems[1];
    expect(noteToUpdate).toHaveTextContent(savedNotes[1].note);

    await user.click(noteToUpdate);

    const editNoteBtn = await screen.findByRole("button", { name: /edit/i });
    await user.click(editNoteBtn);

    expect(textBox).toBeEnabled();

    await user.clear(textBox);
    await user.type(textBox, note2UpdateText);

    const updateNoteBtn = await screen.findByRole("button", {
      name: /update/i,
    });

    await user.click(updateNoteBtn);
    
    const updatedNoteItems = await screen.findAllByRole("listitem");

    expect(textBox).toHaveValue("");
    expect(updateNoteBtn).not.toBeInTheDocument();
    expect(updatedNoteItems[0]).toHaveTextContent(note2UpdateText);
    expect(updatedNoteItems.length).toBe(2);
  });

  it("should show unsaved note alert", async () => {
    const { user, ...screen } = renderWithQueryClient(
      queryClient,
      <Note groupId={placeOneId} />
    );

    const noteItem = await screen.findByRole("listitem");
    const textBox = screen.getByRole("textbox");
    await user.type(textBox, "Hi there!");
    await user.click(noteItem);

    const unsavedAlert = await screen.findByText(
      /You may lose some unsaved changes/i
    );

    expect(unsavedAlert).toBeInTheDocument();
  });

  it("should delete note", async () => {
    const { user, ...screen } = renderWithQueryClient(
      queryClient,
      <Note groupId={placeOneId} />
    );

    const noteItem = await screen.findByRole("listitem");
    const deleteNoteBtn = await within(noteItem).findByTestId("DeleteIcon");
    await user.click(deleteNoteBtn);
    expect(noteItem).not.toBeInTheDocument();
  });

  it('should show "No Notes" message when empty', () => {
    const { user, ...screen } = renderWithQueryClient(
      queryClient,
      <Note groupId={placeOneId} />
    );

    const noNotesElement = screen.getByText(
      /Your saved notes will appear here/i
    );

    expect(noNotesElement).toBeInTheDocument();
  });
});
