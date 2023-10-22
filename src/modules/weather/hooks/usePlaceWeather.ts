import { usePlace } from "../../place/usePlace";
import { useWeather } from "./useWeather";

const usePlaceWeather = (placeId: number) => {
  const { place, addToBookmarks, removeFromBookmarks } = usePlace(placeId);

  const { weather, isLoading, status } = useWeather({
    place,
    options: {
      useErrorBoundary: (_, query) => {
        return !query.state.data;
      },
    },
  });

  const isBookmarked = place?.bookmarked;

  const toggleSavePlace = () => {
    if (place) {
      isBookmarked ? removeFromBookmarks() : addToBookmarks();
    }
  };

  const data = weather && place ? { weather, place } : null;

  return { data, isBookmarked, isLoading, status, toggleSavePlace };
};

export default usePlaceWeather;
