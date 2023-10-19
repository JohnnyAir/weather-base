import { ReactNode } from "react";
import style from "./forecast.module.css";

interface ForecastItemProps {
  title: string;
  temp1: string;
  temp2?: string;
  icon: string;
  description: string;
}

export const ForecastItem = ({
  temp1,
  title,
  temp2,
  icon,
  description,
}: ForecastItemProps) => {
  return (
    <div className={style.item}>
      <p className={style.title}>{title}</p>
      <img className={style.icon} src={`/icons/${icon}.png`} />
      <div className={style.details}>
        <p className={style.highTemp}>
          {temp1}
          {temp2 && <span className={style.lowTemp}>{temp2}</span>}
        </p>
        <p className={style.desc}>{description}</p>
      </div>
    </div>
  );
};

interface ForecastCardProps {
  title: string;
  children: ReactNode;
}

const ForecastCard = (props: ForecastCardProps) => {
  const { title, children } = props;

  return (
    <section className="card">
      <div className={style.content}>
        <div className={style.cardTitle}>
          <h4> {title} </h4>
        </div>
        <div className={style.forecastsList}>{children}</div>
      </div>
    </section>
  );
};

export default ForecastCard;
