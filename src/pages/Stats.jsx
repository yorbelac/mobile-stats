// app/Stats

//dependencies
import { useState, useEffect } from 'react'
import moment from 'moment'
import axios from 'axios'

//components
import ChartRevenue from '../components/charts/ChartRevenue'
import TableRevenue from '../components/tables/TableRevenue'
import Spinner from '../components/Spinner'

function Stats({ config }) {

  const [tabs, setTabs] = useState([])

  //loading
  const [loaded, setLoaded] = useState(false)


  //tuned arrays///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //ORDERS
  const orders = tabs
    .filter(
      (tab) =>
        tab.item !== "CASH" &&
        tab.item !== "CHANGE" &&
        tab.item !== "CREDIT" &&
        tab.item !== "TIP"
    )
    .map((o) => {
      return {
        date: moment(o.createdAt)
          .subtract(2, "hours")
          .format("M/D/YYYY"),
        total: o.cost
      };
    });

  //PAYMENTS
  const payments = tabs.filter((tab) => tab.item === "CASH" || tab.item === "CHANGE" || tab.item === "CREDIT").map((o) => {
    return {
      date: moment(o.createdAt)
        .subtract(2, "hours")
        .format("M/D/YYYY"),
      total: o.cost
    };
  });

  const cashs = tabs.filter((tab) => tab.item === "CASH" || tab.item === "CHANGE").map((o) => {
    return {
      date: moment(o.createdAt)
        .subtract(2, "hours")
        .format("M/D/YYYY"),
      total: o.cost
    };
  });

  const credits = tabs.filter((tab) => tab.item === "CREDIT").map((o) => {
    return {
      date: moment(o.createdAt)
        .subtract(2, "hours")
        .format("M/D/YYYY"),
      total: o.cost
    };
  });

  //TIPS
  const tips = tabs.filter((tab) => tab.item === "TIP").map((o) => {
    return {
      date: moment(o.createdAt)
        .subtract(2, "hours")
        .format("M/D/YYYY"),
      total: o.cost
    };
  });

  //CHART dates///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //attempting state based dates
  const [scope, setScope] = useState('day')

  const [dayLeft, setDateLeft] = useState(new Date(moment().subtract(14, 'days')))
  const [dayRight, setDateRight] = useState(new Date())

  const upDateLeft = () => {
    setDateLeft(document.getElementById('dayLeft').value)
  }
  const upDateRight = () => {
    setDateRight(document.getElementById('dayRight').value)
  }

  let balance = payments
    .filter((tab) => moment(tab.date) <= moment(dayLeft).subtract(2, 'hours'))
    .reduce((x, y) => (x = x + y.total), 0)
    + orders
      .filter((tab) => moment(tab.date) <= moment(dayLeft).subtract(2, 'hours'))
      .reduce((x, y) => (x = x + y.total), 0)

  //THE LOOP (X = DAYS)////AND ARRAYS////////////////////////////////////////////////////////////////////////////////////////////////////////////
  let day = moment(dayLeft).subtract(2, 'hours');
  let data = new Array();
  let dataR = new Array();

  while (day <= moment(dayRight)) {

    var order = orders
      .filter((tab) => tab.date === day.format('M/D/YYYY'))
      .reduce((x, y) => (x = x + y.total), 0)
    var cash = -cashs
      .filter((tab) => tab.date === day.format('M/D/YYYY'))
      .reduce((x, y) => (x = x + y.total), 0)
    var credit = -credits
      .filter((tab) => tab.date === day.format('M/D/YYYY'))
      .reduce((x, y) => (x = x + y.total), 0)
    var tip = -tips
      .filter((tab) => tab.date === day.format('M/D/YYYY'))
      .reduce((x, y) => (x = x + y.total), 0)

    data.push({
      date: day.format('M/D'),
      orders: order,
      cash: cash,
      credit: credit,
      tips: tip,
      balance: balance,
    });
    balance = balance - (cash + credit) + order
    day = day.add(1, "days");

  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const getData = async () => {
    console.log('stats.getData()')
    try {
      const response = await axios.get("https://tabsbp.herokuapp.com/api/tabs", config)
      setTabs(response.data)
      setLoaded(true)
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect(() => {
  //   if (!data.length) {
  //     setLoaded(true)
  //   } else {
  //     setLoaded(false)
  //   }
  // }, [data, dayLeft, dayRight])

  useEffect(() => {
    getData()
  }, [])

  return (

    <div className="container">
      <div className="col1">
        <h2>Stats</h2>
      </div>

      {loaded ?
        <>
          <div className="col1">
            <div className='col2'>
              <div style={{ float: 'left' }}>
                <input
                  label='start date'
                  type='date'
                  id='dayLeft'
                  placeholder='start date'
                  onChange={upDateLeft}
                />
              </div>
              <div style={{ float: 'right' }}>
                <input
                  type='date'
                  id='dayRight'
                  placeholder='end date'
                  onChange={upDateRight}
                />
              </div>
            </div>
            <div>
              {/* <button style={{margin: "5px", padding: "5px"}} onClick={() => setScope('previous')}>prev</button>
            <button style={{margin: "5px", padding: "5px"}} onClick={() => setScope('hour')}>hour</button> */}
              {/* <button style={{ margin: "5px", padding: "5px" }} onClick={() => setScope('day')}>day</button>
              <button style={{ margin: "5px", padding: "5px" }} onClick={() => setScope('week')}>week</button> */}
              {/* <button style={{margin: "5px", padding: "5px"}} onClick={() => setScope('month')}>month</button>
            <button style={{margin: "5px", padding: "5px"}} onClick={() => setScope('year')}>year</button>
            <button style={{margin: "5px", padding: "5px"}} onClick={() => setScope('next')}>next</button> */}
            </div>
            <div>
              <br />
              <br />
              <ChartRevenue data={data} responsive='true' />
              {/* <hr style={{width:'50vw', borderTop:'1px solid lightgrey'}}/> */}
              <br />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: 'auto', minHeight: '400px' }}>
              <TableRevenue data={data} />
            </div>

          </div>
        </>
        :
        <>
          <Spinner />
          <p>Downloading all data. Please Wait</p>
        </>

      }


    </div>

  )
}

export default Stats
