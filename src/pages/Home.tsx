import MyLocation from "../modules/weather/CurrentWeatherCard/MyLocation";
import SavedPlaces from "../modules/weather/SavedPlaces";

function MainPage() {
  return (
    <div className="stack-space-2">
      <MyLocation />
      <SavedPlaces />
    </div>
  );
}

export default MainPage;
