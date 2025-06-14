import { Button } from "@mui/material";
import React, { Component, Fragment, ReactNode } from "react";
import SyncIcon from "@mui/icons-material/Sync";

interface Props {
  children: ReactNode;
  fallbackComponent: JSX.Element;
}
interface State {
  hasError: boolean;
  errorIs?: Error;
  refresh?: number;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, refresh: 0 };
  }

  static getDerivedStateFromError(error: Error): State | null {
    return { hasError: true, errorIs: error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Fragment>
          <Button
            startIcon={<SyncIcon />}
            onClick={() => {
              this.setState((prevState) => {
                return {
                  refresh: prevState.refresh ? prevState.refresh + 1 : 2,
                  hasError: false,
                };
              });
            }}
          >
            Refresh
          </Button>
          {this.props.fallbackComponent}
        </Fragment>
      );
    }

    return <Fragment key={this.state.refresh}>{this.props.children}</Fragment>;
  }
}
export default ErrorBoundary;
