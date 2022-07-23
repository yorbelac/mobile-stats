// APP

//dependencies
import "./index.css";
import { useState, useEffect } from "react";
import axios from "axios";

//components
import Navbar from "./components/Navbar";
import Stats from "./pages/Stats";
import Menu from "./pages/Menu";
import Customers from "./pages/Customers";
import Spinner from "./components/Spinner"

// CORS enabled now using URLS and fetch but here still are the placeholders to the static data.
const TABS_URL = 'https://tabsbp.herokuapp.com/api/tabs'
const MENU_URL = 'https://tabsbp.herokuapp.com/api/menu'
const CUST_URL = 'https://tabsbp.herokuapp.com/api/customers'

export default function App() {

  const [loaded, setLoaded] = useState(false)  
  const [customers, setCustomers] = useState([])
  const [tabs, setTabs] = useState([])
  const [menu, setMenu] = useState([])
  const [tabStats, setTabStats] = useState([])
  const [customerStats, setCustomerStats] = useState([])

    //NAVIGATION
    const [nav, setNav] = useState("stats");
    const go = (page) => {
      setNav(page)
    }

    //HEADER CONFIGURATION (seal this shit up, stupid)
  const config = {
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYzQ5NzQ0ZmVhNTIxYjRjMGYwYjgzZCIsImlhdCI6MTY1NzkxMzEwOCwiZXhwIjoxNjYwNTA1MTA4fQ.YHK8l-G880-dvcg-A0nGaNdsWbfwxOBFKMZcrRDrH5w'
    }
  }

  async function getData() {
    try {
      await axios.get(CUST_URL,config).then(res => setCustomers(res.data));
      await axios.get(MENU_URL,config).then(res => setMenu(res.data));
      await axios.get(TABS_URL,config).then(res => setTabs(res.data));
    } catch (error) {
      console.log(error)
    }
  }  

  //useEffect for fetchData
  useEffect(() => {
    getData()
  },[])

  //this useEffect watches tabs and generates arrays for the other pages.
  useEffect(() => {

    //generate statsTabs
    setTabStats(tabs.filter((tab) => 
      !isNaN(tab.cost)
      && tab.customer !== ''
    ))

    if (tabStats.length !== 0) {
      setLoaded(true)
    }
    
  },[tabs,tabStats.length])

  return (
    <div>
      
      <Navbar nav={go}/>
      <>
        {loaded === true ? 
        <>
          <>{nav === 'stats' ? <Stats tabs={tabStats}/> : ''}</>
          <>{nav === 'customers' ? <Customers customers={customers} tabs={tabStats}/> : ''}</>
          <>{nav === 'menu' ? <Menu menu={menu} tabs={tabStats}/> : ''}</>
        </>
        : 
          <Spinner/>
        }
      </>

    </div>
  );
}
