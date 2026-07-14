import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

function MainLayout() {

    return (

        <div className="min-h-screen bg-slate-100">

            {/* Navigation */}

            <Navbar />

            {/* Main Content */}

            <main className="
                w-full
                max-w-7xl
                mx-auto
                px-4
                sm:px-6
                lg:px-8
                py-6
                sm:py-8
            ">

                <Outlet />

            </main>

        </div>

    );

}

export default MainLayout;