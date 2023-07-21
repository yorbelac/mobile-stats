// app/Customers

//dependencies
import { useState } from 'react'
import moment from 'moment'
import { CSVLink } from 'react-csv'

//components
import ChartCustomer from '../components/charts/ChartCustomer'
import customerCalc from '../features/customers/customerCalc'

function Customers({ customers, tabs }) {

  // VARIABLES //

  //defines today and formats it to common date format
  const today = moment().subtract(2, 'hours').format('M/D/YYYY')

  //filters to tabs logged TODAY
  const todayTabs = tabs.filter((t) => moment(t.createdAt).subtract(2, 'hours').format('M/D/YYYY') === today)

  //todayTabs//
  //orders
  const todayOrders = todayTabs.filter((t) => t.item !== ("CASH" && "CREDIT" && "CHANGE" && "TIP")).reduce((a, b) => a + b.cost, 0)
  //payments
  const todayCash = todayTabs.filter((t) => t.item === "CASH").reduce((a, b) => a + b.cost, 0)
  const todayCredit = todayTabs.filter((t) => t.item === 'CREDIT').reduce((a, b) => a + b.cost, 0)
  const todayChange = todayTabs.filter((t) => t.item === 'CHANGE').reduce((a, b) => a + b.cost, 0)
  const todayTips = todayTabs.filter((t) => t.item === 'TIP').reduce((a, b) => a + b.cost, 0)

  //todayRev
  const todayRev = todayCash + todayCredit + todayChange + todayTips


  //creates an array of unique customer names
  const uniqueNames = [...new Set(tabs.map(tab => tab.customer))]

  //generates array of balances for each unique customer name and if nonzero amount it adds it to 'customer balances' list
  const balances = []
  for (let i = 0; i < uniqueNames.length; i++) {
    let balance = tabs.filter((tab) =>
      tab.customer === uniqueNames[i]
      && tab.customer !== ''
      && tab.item !== 'TIP'
      && tab.item !== 'Tip').reduce((x, y) => x = x + y.cost, 0)
    if (balance > 1 || balance < -1) {
      balances.push({ customer: uniqueNames[i], balance: balance })
    }
  }
  balances.sort((a, b) => b.balance - a.balance)

  //the sum of all nonzero balances
  const totalBalance = balances.reduce((a, b) => a + b.balance, 0)

  //customer selection logic /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [name, setName] = useState('') //customer name
  const selectCustomer = (customer) => {
    setName(customer)
  }

  //tuned arrays///////////////////////////////////////////////////////////////////////////////////////////////////
  //CUSTOMER TAB
  const customerTab = tabs.filter((tab) => //when name selected, filter to ordered items
    tab.customer === name)

  // console.log(customerTab)

  //ORDERS
  const orders = customerTab
    .filter(
      (tab) =>
        tab.item !== "CASH" &&
        tab.item !== "CHANGE" &&
        tab.item !== "Change" &&
        tab.item !== "CREDIT" &&
        tab.item !== "Tip" &&
        tab.item !== "TIP"
    )
    .map((o) => {
      return {
        date: moment(o.createdAt)
          .subtract(2, "hours")
          .format("M/D/YYYY"),
        item: o.item,
        total: o.cost
      };
    });

  //PAYMENTS
  const payments = customerTab
    .filter(
      (tab) =>
        tab.item === "CASH" || tab.item === "CHANGE" || tab.item === "CREDIT"
    )
    .map((o) => {
      return {
        date: moment(o.createdAt)
          .subtract(2, "hours")
          .format("M/D/YYYY"),
        total: o.cost
      };
    });

  const cashs = customerTab
    .filter(
      (tab) =>
        tab.item === "CASH" || tab.item === "CHANGE"
    ).map((o) => {
      return {
        date: moment(o.createdAt)
          .subtract(2, "hours")
          .format("M/D/YYYY"),
        total: o.cost
      };
    });

  const credits = customerTab
    .filter(
      (tab) =>
        tab.item === "CREDIT"
    ).map((o) => {
      return {
        date: moment(o.createdAt)
          .subtract(2, "hours")
          .format("M/D/YYYY"),
        total: o.cost
      };
    });

  //TIPS
  const tips = customerTab
    .filter((tab) => tab.item === "TIP")
    .map((o) => {
      return {
        date: moment(o.createdAt)
          .subtract(2, "hours")
          .format("M/D/YYYY"),
        total: o.cost
      };
    });

  //CHART dates///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //attempting state based dates
  const [dayLeft, setDateLeft] = useState(new Date("July 1 2022 02:00"))
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
  let data = [];
  let dataR = [];

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

  //Array reversal for chart
  dataR = data.slice().sort((a, b) => a.date - b.date)

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  //unique items list for customer table
  const uniqueItems = [...new Set(orders.map((tab) => tab.item))] //all unique items selected customer has ordered

  //customer orders by item
  let profile = []
  for (let i = 0; i < uniqueItems.length; i++) {
    profile.push({
      item: uniqueItems[i],
      count: orders.filter((tab) => uniqueItems[i] === tab.item).length,
      revenue: orders.filter((tab) => uniqueItems[i] === tab.item).length * orders.filter((tab) => uniqueItems[i] === tab.item)[0].total
    })
  }

  const csvData = customerTab.slice().reverse().map((t) => {
    return { id: t._id, dateCreated: moment(t.createdAt).format('M/D/Y'), timeCreated: moment(t.createdAt).format('h:mm:ss A'), dateUpdated: moment(t.updatedAt).format('M/D/Y'), timeUpdated: moment(t.updatedAt).format('h:mm:ss A'), customer: t.customer, item: t.item, cost: t.cost, status: t.status, }
  })

  // UI //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div>
      <section name="today" style={{ backgroundColor: 'whiteSmoke', padding: '20px', borderBottom: '1px solid grey' }}>
        <h1 style={{ marginBottom: '-20px' }}>Customer Data</h1>
        <h3>{moment(today).format('dddd | MMMM DD, YYYY')}</h3>

      </section>
      <section name="inHouse" style={{ borderBottom: '1px solid black', paddingBottom: '40px' }}>
        <h2>In-House Customers</h2>
        <table style={{ margin: 'auto', fontSize: "28px" }} cellSpacing='0'>
          <thead>
            <tr style={{ backgroundColor: 'lightgrey' }}>
              <td style={{ textAlign: 'left', fontFamily: 'poppins', border: '0px' }}><b>Name</b></td>
              <td><b>Balance</b></td>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) =>
              <tr onClick={() => selectCustomer(customer.name)}>
                <td style={{ textAlign: 'left', fontFamily: 'poppins', borderBottom: '1px solid lightgrey' }}>{customer.name}</td>
                <td style={{ borderBottom: '1px solid lightgrey' }}>
                  {(balances.filter(o => o.customer === `${customer.name}`).map(o => o.balance)[0] = balances.filter(o => o.customer === `${customer.name}`).map(o => o.balance)[0] || 0).toFixed(2)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section name="balances" style={{ borderBottom: '1px solid black', paddingBottom: '40px' }}>
        <h2>Customer Balances</h2>
        <table style={{ margin: 'auto' }} cellSpacing='0'>
          <thead>
            <tr style={{ border: '1px solid grey', backgroundColor: 'whitesmoke' }}>
              <td style={{ textAlign: 'left', fontFamily: 'poppins' }}><b>TOTAL</b></td>
              <td></td>
              <td><b>{totalBalance.toFixed(2)}</b></td>
            </tr>
            <tr style={{ backgroundColor: 'lightgrey' }}>
              <td style={{ textAlign: 'left', fontFamily: 'poppins', border: '0px' }}><b>Name</b></td>
              <td><b>Last Seen</b></td>
              <td><b>Balance</b></td>
            </tr>
          </thead>
          <tbody>
            {balances.map((tab) =>
              <tr onClick={() => selectCustomer(tab.customer)}>
                <td style={{ textAlign: 'left', fontFamily: 'poppins' }}>{tab.customer}</td>
                <td>{moment(tabs.filter((all) => all.customer === tab.customer).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt).fromNow(true)}</td>
                <td>{tab.balance.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <br />

      <section name="tabs" style={{ padding: '10px' }}>
        <h3>Tab Profile: {name}</h3>
        {name === '' ?
          <p>(click a name)</p>
          :
          <>
            <div className='col2' style={{ padding: '10px' }}>
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
            <br />
            <ChartCustomer data={dataR} name={name} responsive='true' />
            <br />

            <h3>Customer Preferences</h3>
            <table style={{ margin: 'auto' }} cellSpacing='0'>
              <thead>
                <tr style={{ backgroundColor: 'whitesmoke' }}>
                  <td style={{ textAlign: 'left', fontFamily: 'poppins', border: '0px' }}>TOTAL</td>
                  <td>{profile.reduce((a, b) => a + b.count, 0)}</td>
                  <td>{profile.reduce((a, b) => a + b.revenue, 0).toFixed(2)}</td>
                </tr>
                <tr style={{ backgroundColor: 'lightgrey' }}>
                  <td style={{ textAlign: 'left', fontFamily: 'poppins', border: '0px' }}><b>Name</b></td>
                  <td><b>Qty</b></td>
                  <td><b>Rev</b></td>
                </tr>
              </thead>
              <tbody>
                {profile.sort((a, b) => b.count - a.count).slice(0, 10).map((tab) =>
                  <tr>
                    <td style={{ textAlign: 'left', fontFamily: 'poppins' }}>{tab.item}</td>
                    <td>{tab.count}</td>
                    <td>{tab.revenue.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <h3>All Customer Orders</h3>
            <CSVLink data={csvData} filename={"stats.csv"} style={{ marginBottom: '10px' }}>
              Export to CSV
            </CSVLink>
            <table style={{ margin: 'auto', marginTop: '20px' }} cellSpacing='0'>
              <thead>
                <tr style={{ backgroundColor: 'lightgrey' }}>
                  <td style={{ textAlign: 'left', fontFamily: 'poppins', border: '0px' }}><b>Date</b></td>
                  <td><b>Time</b></td>
                  <td><b>Item</b></td>
                  <td><b>Cost</b></td>
                  <td><b>Status</b></td>
                </tr>
              </thead>
              <tbody>
                {customerTab.slice().reverse().map((t) =>
                  <tr>
                    <td>{moment(t.createdAt).format('M/D/Y')}</td>
                    <td>{moment(t.createdAt).format('h:mm:ss A')}</td>
                    <td>{t.item}</td>
                    <td>{t.cost.toFixed(2)}</td>
                    <td>{t.status}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        }
      </section>

      {/* these <br>s exist to keep the scroll above the navbar */}
      <br />
      <br />
    </div>
  )
}

export default Customers

// style={moment(entry.date).format('D') % 2 == 0 ? {backgroundColor:'whitesmoke'} : {}}
