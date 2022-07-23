// app/Customers

//dependencies
import { useState } from 'react'
import moment from 'moment'

//components

function Customers({customers, tabs}) {

  //variables
  const [name, setName] = useState('Mikey')
  const uniqueNames = [...new Set(tabs.map(tab => tab.customer))]
  const uniqueItems = [...new Set(tabs.map(tab => tab.item))]

  //enables customer selection for customer detail
  const selectCustomer = (customer) => {
    setName(customer)
    console.log(customer)
  }

  const balances = []
  for (let i = 0; i < uniqueNames.length; i++) {
    let balance = tabs.filter((tab) => tab.customer === uniqueNames[i] && tab.customer != '' && tab.item != 'TIP' && tab.item != 'Tip').reduce((x,y) => x = x + y.cost, 0)
    if (balance > 1 || balance < -1) {
      balances.push({customer: uniqueNames[i], balance: balance})
    }      
  }
  balances.sort((a,b) => b.balance - a.balance)
  const totalBalance = balances.reduce((a,b) => a + b.balance, 0)

  return (
    <div>

      <section name="inHouse">
        <h2>Customers in-house</h2>
        <table style={{margin:'auto'}} cellSpacing='0'>
          <thead>
            <tr style={{backgroundColor:'lightgrey'}}>
              <td style={{textAlign:'left', fontFamily:'poppins', border:'0px'}}><b>Name</b></td>
              <td><b>Balance</b></td>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => 
              <tr>
                <td style={{textAlign:'left', fontFamily:'poppins'}}>{customer.name}</td>
                <td>
                  {(balances.filter(o => o.customer === `${customer.name}`).map(o => o.balance)[0]= balances.filter(o => o.customer === `${customer.name}`).map(o => o.balance)[0] || 0).toFixed(2)}
                </td>
              </tr>          
            )}
          </tbody>
        </table>
      </section>

      <section name="balances">
        <h2>Customer Balances</h2>
        <table style={{margin:'auto'}} cellSpacing='0'>
          <thead>
            <tr style={{border:'1px solid grey', backgroundColor:'whitesmoke'}}>
              <td style={{textAlign:'left', fontFamily:'poppins'}}><b>TOTAL</b></td>
              <td></td>
              <td><b>{totalBalance.toFixed(2)}</b></td>
            </tr>
            <tr style={{backgroundColor:'lightgrey'}}>
              <td style={{textAlign:'left', fontFamily:'poppins', border:'0px'}}><b>Name</b></td>
              <td><b>Last Seen</b></td>
              <td><b>Balance</b></td>
            </tr>
          </thead>
          <tbody>
            {balances.map((tab) => 
              <tr onClick={() => selectCustomer(tab.customer)}>
                <td style={{textAlign:'left', fontFamily:'poppins'}}>{tab.customer}</td>
                <td>{moment(tabs.filter((all) => all.customer === tab.customer).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt).fromNow(true)}</td>
                <td>{tab.balance.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section name="tabs">
        <h2>Select customer to view tab</h2>
        <p>(under construction)</p>
        <p>(common orders and qty for each menu category)</p>
      </section>

      {/* these <br>s exist to keep the scroll above the navbar */}
      <br/>
      <br/>
    </div>
  )
}

export default Customers

// style={moment(entry.date).format('D') % 2 == 0 ? {backgroundColor:'whitesmoke'} : {}}
