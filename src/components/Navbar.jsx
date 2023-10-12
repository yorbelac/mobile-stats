// app/Stats

//dependencies
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDining } from "react-icons/md";
import { FcConferenceCall, FcComboChart, FcHome } from "react-icons/fc";

//components

function Navbar({nav}) {

    // const navigate = useNavigate();
    const [panel, setPanel] = useState("today");

    const goCustomers = () => {
      setPanel('customers')
      nav('customers')
    }
    const goStats = () => {
      setPanel('stats')
      nav('stats')
    }
    const goMenu = () => {
      setPanel('menu')
      nav('menu')
    }
    const goToday = () => {
      setPanel('today')
      nav('today')
    }
  
    return (
      <div className="navbar" style={{zIndex:1}}>
        <div className='navMenu'>
        <div
          className={`${panel === "today" ? "navItemActive" : "navItem"}`}
          onClick={goToday}
        >
          <FcHome />
        </div>
        <div
          className={`${panel === "customers" ? "navItemActive" : "navItem"}`}
          onClick={goCustomers}
        >
          <FcConferenceCall />
        </div>
        <div
          className={`${panel === "stats" ? "navItemActive" : "navItem"}`}
          onClick={goStats}
          style={{ borderRight: "1px solid #ccc" }}
        >
          <FcComboChart />
        </div>
        {/* <div
          className={`${panel === "menu" ? "navItemActive" : "navItem"}`}
          onClick={goMenu}
          style={{ borderRight: "1px solid #ccc" }}
        >
          <MdDining />
        </div> */}
        </div>
      </div>
    );
}

export default Navbar