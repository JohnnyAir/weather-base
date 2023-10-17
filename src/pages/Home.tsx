import MyLocation from "../modules/weather/current-weather/MyLocation";
import BookmarkedPlaces from "../modules/weather/bookmarks";

const HomePage = () => {
  return (
    <div className="stack-space-2">
      <MyLocation />
      <BookmarkedPlaces />
    </div>
  );
};

export default HomePage;
