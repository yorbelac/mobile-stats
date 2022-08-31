// app/Stats

//dependencies
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDining } from "react-icons/md";
import { FcConferenceCall, FcComboChart } from "react-icons/fc";
import { RiTimerFill } from 'react-icons/ri'

//components

function Navbar({nav}) {

    // const navigate = useNavigate();
    const [panel, setPanel] = useState("customers");

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
    const goKitchen = () => {
      setPanel('kitchen')
      nav('kitchen')
    }
  
    return (
      <div className="navbar" style={{zIndex:1}}>
        <div className='navMenu'>
        <div
          className={`${panel === "customers" ? "navItemActive" : "navItem"}`}
          onClick={goCustomers}
        >
          <FcConferenceCall />
        </div>
        <div
          className={`${panel === "stats" ? "navItemActive" : "navItem"}`}
          onClick={goStats}
        >
          <FcComboChart />
        </div>
        <div
          className={`${panel === "menu" ? "navItemActive" : "navItem"}`}
          onClick={goMenu}
          style={{ borderRight: "1px solid #ccc" }}
        >
          <MdDining />
        </div>
        <div
          className={`${panel === "kitchen" ? "navItemActive" : "navItem"}`}
          onClick={goKitchen}
          style={{ borderRight: "1px solid #ccc" }}
        >
          <RiTimerFill />
        </div>
        </div>
      </div>
    );
}

export default Navbar