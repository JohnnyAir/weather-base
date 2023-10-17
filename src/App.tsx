import { RouterProvider } from "react-router-dom";
import { ClientProvider } from "./modules/client/client";
import { router } from "./router";

function App() {
  return (
    <ClientProvider>
      <RouterProvider router={router} />
    </ClientProvider>
  );
}

export default App;
