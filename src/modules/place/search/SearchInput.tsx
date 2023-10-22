import { ChangeEventHandler, Fragment, useState } from "react";
import style from "./search.module.css";
import { useClickOutside } from "../../../utils/hooks";

export type SearchInputProps<T> = {
  value: string;
  placeholder?: string;
  suggestions: T[] | null | undefined;
  optionKey?: keyof T;
  emptySuggestionText?: string;
  getSuggestionsText: (option: T) => string;
  onChange: ChangeEventHandler;
  onSuggestionSelected: (option: T) => void;
};

export const SearchInput = <T extends Record<string, any>>({
  value,
  suggestions,
  placeholder,
  onChange,
  emptySuggestionText,
  optionKey,
  getSuggestionsText,
  onSuggestionSelected,
}: SearchInputProps<T>) => {
  const [showSuggestion, setShowSuggestions] = useState(false);

  const containerRef = useClickOutside(() => setShowSuggestions(false));

  const shouldShowSuggestion =
    showSuggestion && suggestions && value.length > 0;

  return (
    <div className={style.searchContainer} ref={containerRef}>
      <input
        className={style.input}
        type="text"
        onChange={onChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        value={value}
      />
      <div className={style.icon}>
        <svg
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
          data-testid="SearchIcon"
        >
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
        </svg>
      </div>
      {shouldShowSuggestion ? (
        <div className={style.dropdownContent}>
          <ul>
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <Fragment key={suggestion[optionKey || "id"] || index}>
                  {index !== 0 && (
                    <hr aria-disabled="true" className="divider" />
                  )}
                  <li onClick={() => onSuggestionSelected(suggestion)}>
                    {getSuggestionsText(suggestion)}
                  </li>
                </Fragment>
              ))
            ) : (
              <li className={style.noData}>
                {emptySuggestionText || "No Results"}
              </li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default SearchInput;
