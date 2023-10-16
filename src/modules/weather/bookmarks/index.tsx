import { ErrorBoundaryWithQueryReset } from "../../error/ErrorBoundary";
import BookmarkedList from "./BookmarkedList";
import style from "./bookmark.module.css";

function BookmarkedPlaces() {
  return (
    <>
      <h4 className={style.sectionTitle}>Saved Locations</h4>
      <ErrorBoundaryWithQueryReset>
        <BookmarkedList />
      </ErrorBoundaryWithQueryReset>
    </>
  );
}

export default BookmarkedPlaces;
