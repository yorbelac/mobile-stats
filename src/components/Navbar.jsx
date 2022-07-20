// app/Stats

//dependencies
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDining } from "react-icons/md";
import { FcConferenceCall, FcComboChart } from "react-icons/fc";

//components

function Navbar() {
    const navigate = useNavigate();
    const [nav, setNav] = useState("stats");
  
    const stats = () => {
      setNav("stats");
      navigate("/stats");
    };
  
    const customers = () => {
      setNav("customers");
      navigate("/customers");
    };
  
    const menu = () => {
      setNav("menu");
      navigate("/menu");
    };
  
    return (
      <div className="navbar">
        <div className='navMenu'>
        <div
          className={`${nav === "customers" ? "navItemActive" : "navItem"}`}
          onClick={customers}
        >
          <FcConferenceCall />
        </div>
        <div
          className={`${nav === "stats" ? "navItemActive" : "navItem"}`}
          onClick={stats}
        >
          <FcComboChart />
        </div>
        <div
          className={`${nav === "menu" ? "navItemActive" : "navItem"}`}
          onClick={menu}
          style={{ borderRight: "1px solid #ccc" }}
        >
          <MdDining />
        </div>
        </div>
      </div>
    );
}

export default Navbar
