import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryComponent } from "../shared/components/ErrorBoundaryComponent";
import { RouterProvider } from "react-router-dom";
import { Providers } from "./Provider";
import { router } from "./routes/router";
import { Suspense } from "react";
import { ToastContainer } from "../shared/components";
import Preloader from "./routes/Preloader";

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorBoundaryComponent}
      onReset={() => window.location.reload()}
    >
      <Providers>
        <Suspense fallback={<Preloader />}>
          <RouterProvider router={router} />
        </Suspense>
        <ToastContainer />
      </Providers>
    </ErrorBoundary>
  );
}

export default App;
