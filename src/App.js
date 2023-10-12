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
import Today from "./pages/Today";
import Spinner from "./components/Spinner"


// CORS enabled now using URLS and fetch but here still are the placeholders to the static data.
const TABS_URL = 'https://tabsbp.herokuapp.com/api/tabs'
const MENU_URL = 'https://tabsbp.herokuapp.com/api/menu'
const CUST_URL = 'https://tabsbp.herokuapp.com/api/customers'

export default function App() {

  // const taxRate = 1.0879

  const [loaded, setLoaded] = useState(true)
  const [customers, setCustomers] = useState([])
  const [tabs, setTabs] = useState([])
  const [menu, setMenu] = useState([])
  const [nav, setNav] = useState("today");

  //NAVIGATION
  const go = (page) => {
    setNav(page)
  }

  //HEADER CONFIGURATION (seal this shit up, stupid)
  const config = {
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYzQ5NzQ0ZmVhNTIxYjRjMGYwYjgzZCIsImlhdCI6MTY2NTk1NzcxNSwiZXhwIjo0NzkwMTYwMTE1fQ.Elntb5X-NjwDra_Nf2KimUJ6Eta38Xpkg6EBmW8xal0'
    }
  }

  async function getData() {
    try {
      await axios.get(CUST_URL, config).then(res => setCustomers(res.data));
      await axios.get(MENU_URL, config).then(res => setMenu(res.data));
      await axios.get(TABS_URL, config).then(res => setTabs(res.data));
    } catch (error) {
      console.log(error)
    }
  }

  //useEffect for fetchData
  useEffect(() => {
    // getData()
  }, [])

  //this useEffect watches tabs and generates arrays for the other pages.
  useEffect(() => {
    if (tabs.length !== 0) {
      setLoaded(true)
    }
  }, [tabs])

  return (
    <div>

      <Navbar nav={go} />
      <>
        {loaded === true ?
          <>
            <>{nav === 'today' ? <Today tabs={tabs} config={config} /> : ''}</>
            <>{nav === 'stats' ? <Stats tabs={tabs} config={config} /> : ''}</>
            <>{nav === 'customers' ? <Customers customers={customers} config={config}/> : ''}</>
            <>{nav === 'menu' ? <Menu menu={menu} tabs={tabs} config={config} /> : ''}</>
          </>
          :
          <Spinner />
        }
      </>

    </div>
  );
}
