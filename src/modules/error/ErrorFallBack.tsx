import { Link } from "react-router-dom";
import { ErrorIcon } from "../shared/icons";
import style from "./error.module.css";

interface Props {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const ErrorFallBack = (props: Props) => {
  
  return (
    <div className="card">
      <div className={style.content}>
        <ErrorIcon width="4rem" height="4rem" />
        <h4>Oops, Something went wrong</h4>
        <p>
          Our team is working hard to fix the issue and get things back on
          track. In the meantime, you can try refreshing the page or coming back
          later. We apologize for any inconvenience, and thank you for your
          patience as we resolve this unexpected error.
        </p>
        <div className={style.actions}>
          <Link to="/"> Go Home </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallBack;
