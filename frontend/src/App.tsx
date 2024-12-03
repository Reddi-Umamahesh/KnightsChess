import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./components/home/LandingPage";
import Game from "./screens/Game";
import {
  RecoilRoot,
} from "recoil";
  import { ToastContainer } from "react-toastify";
import { UserProvider } from "./auth/UserContext";
import LoginForm from "./auth/Login";
import RegisterForm from "./auth/RegisterForm";

function App() {

  const appRouter = createBrowserRouter(
    [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element : <LoginForm />
      }, {
        path: '/signup',
        element : <RegisterForm/>
      },
      {
        path: "/game",
        element: <Game />,
      },
    ],
    {
      future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_relativeSplatPath: true,
        v7_skipActionErrorRevalidation: true,
      },
    }
  );
  return (
    <RecoilRoot>
      <UserProvider>
        <div className=" w-full bg-[#312E2b]">
          <RouterProvider router={appRouter} />
        </div>
        <ToastContainer />
      </UserProvider>
    </RecoilRoot>
  );
}

export default App;
