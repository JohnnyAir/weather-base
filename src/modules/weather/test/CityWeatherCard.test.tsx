import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CityWeatherCard from "../bookmarks/WeatherCard";

vi.mock("../../icons/weather-icon.png", () => "weather-icon-mock.png");

describe("CityWeatherCard Component", () => {
  const place = {
    id: 2566652,
    name: "Abule Ijesha",
    admin1: "Lagos",
    countryCode: "NG",
    countryName: "Nigeria",
    lat: 6.52472,
    lon: 3.38639,
    timezone: "Africa/Lagos",
    timezone_offset: 3600,
  };

  const current = {
    time: new Date(),
    temp: 29.05,
    feels_like: 32.47,
    wind_speed: "17.10kph",
    pressure: "1009hPa",
    visibility: "10Km",
    humidity: "68%",
    uvi: "3.23",
    weathercode: "10d",
    description: "light rain",
    temp_unit: "°C",
  };

  it("should render CityWeatherCard correctly", () => {
    render(
      <CityWeatherCard
        place={place}
        current={current}
        onClick={vi.fn()}
        onRemove={vi.fn()}
      />
    );

    const cityNameElement = screen.getByText(/Abule Ijesha, Lagos, Nigeria/i);
    const tempElement = screen.getByText(current.temp);
    const tempDegree = screen.getByText(/°C/);
    expect(cityNameElement).toBeInTheDocument();
    expect(tempElement).toBeInTheDocument();
    expect(tempDegree).toBeInTheDocument();
  });

  it("should call onRemove when the close icon is clicked", () => {
    const onRemoveMock = vi.fn();
    render(
      <CityWeatherCard
        place={place}
        current={current}
        onClick={vi.fn()}
        onRemove={onRemoveMock}
      />
    );

    const closeIcon = screen.getByTestId("CloseIcon");
    fireEvent.click(closeIcon);
    expect(onRemoveMock).toHaveBeenCalledTimes(1);
  });

  it("should call onClick when the card content is clicked", () => {
    const onClickMock = vi.fn();
    render(
      <CityWeatherCard
        place={place}
        current={current}
        onClick={onClickMock}
        onRemove={vi.fn()}
      />
    );

    const cardContent = screen.getByTestId("city-weather-card");
    fireEvent.click(cardContent);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
