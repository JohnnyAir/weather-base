import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layout";
import Home from "./pages/Home";
import CityWeather from "./pages/CityWeather";
import FourZeroFour from "./pages/404";
import { ClientProvider } from "./modules/api/client";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="city/:id" element={<CityWeather />} />
        <Route path="404" element={<FourZeroFour />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Route>
    )
  );

  return (
    <ClientProvider>
      <RouterProvider router={router} />
    </ClientProvider>
  );
}

export default App;
