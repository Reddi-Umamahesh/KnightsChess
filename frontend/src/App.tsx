import { createBrowserRouter, RouterProvider } from "react-router-dom"
import LandingPage from "./components/home/LandingPage"
import Game from "./components/Game"



function App() {
  
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />
    },
    {
      path: '/game',
      element : <Game/>
    }
  ])
  return (
    <div className=" w-full bg-[#312E2b]">
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App
