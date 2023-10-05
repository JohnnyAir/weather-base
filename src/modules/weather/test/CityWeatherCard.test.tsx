import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CityWeatherCard from "../CityWeatherCard";

vi.mock("../../icons/weather-icon.png", () => "weather-icon-mock.png");

describe("CityWeatherCard Component", () => {
  const city = {
    name: "Nei Mei",
    country: "CountryCode",
  };

  const current = {
    dt: 1689949570,
    sunrise: 1689917956,
    sunset: 1689962763,
    temp: 29.14,
    feels_like: 33.83,
    pressure: 1014,
    humidity: 74,
    dew_point: 24.03,
    uvi: 4.42,
    clouds: 75,
    visibility: 10000,
    wind_speed: 6.69,
    wind_deg: 260,
    wind_gust: 0,
    weather: [
      {
        id: 500,
        main: "Rain",
        description: "light rain",
        icon: "10d",
      },
    ],
    rain: {
      "1h": 0.21,
      "3h": 0,
    },
  };

  const tempUnit = "metric";
  const timezoneOffset = -18000;

  it("should render CityWeatherCard correctly", () => {
    render(
      <CityWeatherCard
        city={city}
        current={current}
        tempUnit={tempUnit}
        timezoneOffset={timezoneOffset}
        onClick={vi.fn()}
        onRemove={vi.fn()}
      />
    );

    const cityNameElement = screen.getByText(/Nei Mei/i);
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
        city={city}
        current={current}
        tempUnit={tempUnit}
        timezoneOffset={timezoneOffset}
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
        city={city}
        current={current}
        tempUnit={tempUnit}
        timezoneOffset={timezoneOffset}
        onClick={onClickMock}
        onRemove={vi.fn()}
      />
    );

    const cardContent = screen.getByTestId("city-weather-card");
    fireEvent.click(cardContent);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
