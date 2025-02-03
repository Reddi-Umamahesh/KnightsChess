// components/Layout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Outlet /> {/* This is where child routes will render */}
      </div>
    </div>
  );
};

export default Layout;
