interface Props {}
import style from "./layout.module.css";

function Loading(props: Props) {
  const {} = props;

  return (
    <div className={style.loader}>
      <img src="/icons/10d.png" alt="loading logo" />
      <div className={style.loaderAnimation}></div>
    </div>
  );
}

export default Loading;
