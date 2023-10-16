import { ApiErrorParams } from "../client/error";
import { Link } from "react-router-dom";
import { ErrorIcon } from "../shared/icons";
import style from "./error.module.css";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";

interface Props<P> {
  error: ApiErrorParams<P>;
  resetErrorBoundary: () => void;
}

const ApiErrorFallBack = <T extends Object>({
  resetErrorBoundary,
  error,
}: Props<T>) => {
  const { reset } = useQueryErrorResetBoundary();

  const handleReset = () => {
    reset();
    resetErrorBoundary();
  };

  return (
    <div className="card">
      <div className={style.content}>
        <ErrorIcon width="4rem" height="4rem" />
        <h4>Something went wrong</h4>
        <p>{error.message}</p>
        <div className={style.actions}>
          <Link to="/"> Go Home </Link>
          {error.isRetryable && (
            <button onClick={handleReset} className="button">
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiErrorFallBack;
