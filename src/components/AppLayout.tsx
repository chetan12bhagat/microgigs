import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="w-full max-w-7xl mx-auto px-4">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
