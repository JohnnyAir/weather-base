import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchInput, SearchInputProps } from "../SearchInput";

describe("SearchInput Component", () => {
  const onChangeMock = vi.fn();
  const onSuggestionSelectedMock = vi.fn();

  const suggestions = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Banana" },
    { id: 3, name: "Orange" },
  ];

  const props: SearchInputProps<(typeof suggestions)[0]> = {
    value: "",
    suggestions,
    placeholder: "Search...",
    getSuggestionsText: (option) => option.name,
    onChange: onChangeMock,
    onSuggestionSelected: onSuggestionSelectedMock,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the input element", () => {
    render(<SearchInput {...props} />);
    const inputElement = screen.getByPlaceholderText("Search...");
    expect(inputElement).toBeInTheDocument();
  });

  it("should show suggestions when input is focused", () => {
    render(<SearchInput {...props} value="Ba" />);
    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.focus(inputElement);
    const suggestionList = screen.getByRole("list");
    expect(suggestionList).toBeInTheDocument();
  });

  it("should show suggestions when typing with valid suggestions", () => {
    render(<SearchInput {...props} value="Ban" />);
    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.focus(inputElement);
    const suggestionList = screen.getByRole("list");
    expect(suggestionList).toBeInTheDocument();
  });

  it("should hide suggestions when clicked outside", () => {
    render(<SearchInput {...props} value="Ban" />);
    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.focus(inputElement);
    expect(screen.getByRole("list")).toBeInTheDocument();

    fireEvent.click(document.body);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it('should show "No Results" when no suggestions', () => {
    render(<SearchInput {...props} suggestions={[]} value="Mango" />);
    const inputElement = screen.getByPlaceholderText("Search...");
    fireEvent.focus(inputElement);

    const noResultsElement = screen.getByText("No Results");
    expect(noResultsElement).toBeInTheDocument();
  });

  it("should call onSuggestionSelected when a suggestion is clicked", () => {
    render(<SearchInput {...props} value="Ban" />);
    const inputElement = screen.getByPlaceholderText("Search...");

    fireEvent.focus(inputElement);
    const suggestionItem = screen.getByText("Banana");

    fireEvent.click(suggestionItem);
    expect(onSuggestionSelectedMock).toHaveBeenCalledWith(suggestions[1]);
  });
});
