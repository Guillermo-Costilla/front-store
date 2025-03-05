import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const Main = () => {
    return (
        <div className='min-h-screen flex flex-col'>
            <NavBar />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Main;