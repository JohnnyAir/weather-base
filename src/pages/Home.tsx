import MyLocation from "../modules/weather/current-weather/MyLocation";
import BookmarkedPlaces from "../modules/weather/bookmarks";

const MainPage = () => {
  return (
    <div className="stack-space-2">
      <MyLocation />
      <BookmarkedPlaces />
    </div>
  );
};

export default MainPage;
