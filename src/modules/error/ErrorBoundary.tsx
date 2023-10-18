import { Component, ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ApiError } from "../../client/error";
import ApiErrorFallBack from "./ApiErrorFallBack";
import ErrorFallBack from "./ErrorFallBack";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type NoErrorState = {
  hasError: false;
  error: null;
};

type ErrorState = {
  hasError: true;
  error: Error;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorState | NoErrorState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.log({ error, info });
  }

  reset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const error = this.state.error;

    if (error instanceof ApiError) {
      return <ApiErrorFallBack error={error} resetErrorBoundary={this.reset} />;
    }

    return <ErrorFallBack error={error} resetErrorBoundary={this.reset} />;
  }
}

export const ErrorBoundaryWithQueryReset = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <QueryErrorResetBoundary>
      <ErrorBoundary>{children}</ErrorBoundary>
    </QueryErrorResetBoundary>
  );
};
