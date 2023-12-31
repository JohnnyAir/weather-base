import { Outlet, useLocation } from "react-router";
import style from "./layout.module.css";
import Header from "./header";
import { ChangeEventHandler } from "react";
import { MeasurementUnit } from "../modules/weather/types";
import { ReactComponent as BackIcon } from "../assets/icons/back.svg";
import { cn } from "../utils/helper";
import { Link } from "react-router-dom";
import { useMeasurementUnit } from "../modules/weather/hooks/useMeasurementUnit";
import { useIsRestoring } from "@tanstack/react-query";
import Loading from "./Loading";
import { routes } from "../router";

function MainLayout() {
  const { unit, handleChangeUnit } = useMeasurementUnit();
  const { pathname } = useLocation();
  const handleUnitChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    handleChangeUnit(e.target.value as MeasurementUnit);
  };
  const isRestoringState = useIsRestoring();

  return (
    <>
      <Header />
      <main className={style.main}>
        <div className="container container-lg">
          <div className={style.unitSelect}>
            {pathname !== routes.home.path && (
              <Link to={routes.home.path}>
                <button
                  className={cn("button primary outline has-icon", style.back)}
                >
                  <BackIcon /> Back
                </button>
              </Link>
            )}
            <div></div>
            <select value={unit} onChange={handleUnitChange}>
              <option value="metric">Metric (Celsius, Meters)</option>
              <option value="imperial">Imperial (Farenheit, Miles)</option>
            </select>
          </div>
          {isRestoringState ? <Loading /> : <Outlet />}
        </div>
      </main>
    </>
  );
}

export default MainLayout;
