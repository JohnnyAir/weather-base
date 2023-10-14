import MyLocation from "../modules/weather/current-weather/MyLocation";
import SavedPlaces from "../modules/weather/bookmarks";

const MainPage = () => {
  return (
    <div className="stack-space-2">
      <MyLocation />
      <SavedPlaces />
    </div>
  );
};

export default MainPage;
