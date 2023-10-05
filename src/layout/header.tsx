import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import LocationSearch from "../modules/search/LocationSearch";
import { cn } from "../utils/helper";
import style from "./header.module.css";

function Header() {
  return (
    <header className={style.header}>
      <div className={cn("container container-xl", style.headerContainer)}>
        <div className={style.content}>
          <div className={style.logoGroup}>
            <img className={style.logo} alt="weather info logo" src={logo} />
            <Link className={style.logoText} to="/">
              WeatherBASE
            </Link>
          </div>
          <LocationSearch />
        </div>
      </div>
    </header>
  );
}

export default Header;
