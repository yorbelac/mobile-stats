//app/pages/Today/jsx
//made this page to generate Today data more quickly.
//add to this the ability to scroll dates back and forth

import React, { useState } from 'react'
import moment from 'moment'

function Today({ tabs }) {

    // VARIABLES //
    const [counter, setCounter] = useState(0)

    //defines today and formats it to common date format
    const today = moment().add(counter, 'days').subtract(2, 'hours').format('M/D/YYYY')

    //filters to tabs logged TODAY
    const todayTabs = tabs.filter((t) => moment(t.createdAt).subtract(2, 'hours').format('M/D/YYYY') === today)
    //todayTabs//
    //orders
    const todayOrders = todayTabs.filter((t) => t.item !== "CASH" && t.item !== "CREDIT" && t.item !== "CHANGE" && t.item !== "TIP").reduce((a, b) => a + b.cost, 0)
    //payments
    const todayCash = todayTabs.filter((t) => t.item === "CASH").reduce((a, b) => a + b.cost, 0) * -1
    const todayCredit = todayTabs.filter((t) => t.item === 'CREDIT').reduce((a, b) => a + b.cost, 0) * -1
    const todayChange = todayTabs.filter((t) => t.item === 'CHANGE').reduce((a, b) => a + b.cost, 0) * -1
    const todayTips = todayTabs.filter((t) => t.item === 'TIP').reduce((a, b) => a + b.cost, 0) * -1

    //todayRev
    const todayRev = todayCash + todayCredit + todayChange + todayTips

    const todayReversed = todayTabs.slice().reverse()

    return (
        <div>
            <section name="today" style={{ backgroundColor: 'whiteSmoke', padding: '20px', borderBottom: '1px solid grey' }}>
                <h1 style={{ marginBottom: '-20px' }}>Bites & Pipes Daily</h1>
                <h3>{moment(today).format('dddd | MMMM DD, YYYY')}</h3>
                <button onClick={() => setCounter(counter-1)} style={{padding:'5px', margin:'10px'}}>prev</button>
                <button onClick={() => setCounter(counter+1)} style={{padding:'5px', margin:'10px'}}>next</button>

            </section>
            <section name="today" style={{ padding: '10px', paddingBottom: "40px", borderBottom: '1px solid Black' }}>
                <h3>Day Totals</h3>

                <table style={{ margin: 'auto', fontSize: "28px", marginTop: '30px' }} cellSpacing='0'>


                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'left', fontFamily: 'poppins', borderTop: '1px solid lightgrey', backgroundColor: '#eee' }}><b>Orders</b></td>
                            <td style={{ borderTop: '1px solid lightgrey', backgroundColor: '#eee' }}><b>{todayOrders.toFixed(2)}</b></td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left', fontFamily: 'poppins', borderTop: '1px solid lightgrey' }}>Cash Payments</td>
                            <td style={{ borderTop: '1px solid lightgrey' }}>{(todayCash + todayChange).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left', fontFamily: 'poppins', borderTop: '1px solid lightgrey' }}>Credit Payments</td>
                            <td style={{ borderTop: '1px solid lightgrey' }}>{todayCredit.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left', fontFamily: 'poppins', borderTop: '1px solid lightgrey' }}>Tips</td>
                            <td style={{ borderTop: '1px solid lightgrey' }}>{todayTips.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left', fontFamily: 'poppins', borderTop: '1px solid lightgrey', backgroundColor: '#eee' }}><b>Total Payments</b></td>
                            <td style={{ borderTop: '1px solid lightgrey', backgroundColor: '#eee' }}><b>$ {todayRev.toFixed(2)}</b></td>
                        </tr>
                    </tbody>
                </table>

            </section>

            <section name='tabDisplay' style={{ padding: "0px", borderBottom: '1px solid Black' }}>
                <h3>Day Tabs</h3>
                <table className='borderlessTable'>
                    <thead>
                        <tr style={{ backgroundColor: '#ccc' }}>
                            <th style={{ textAlign: 'left', padding: '10px' }}>time</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>customer</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>item</th>
                            <th>cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todayReversed.map((tab) =>
                            <tr key={tab._id}>
                                <td style={{ textAlign: 'left' }}>{moment(tab.createdAt).format('h:m A')}</td>
                                <td style={{ textAlign: 'left' }}>{tab.customer}</td>
                                <td style={{ textAlign: 'left' }}>{tab.item}</td>
                                <td>{tab.cost.toFixed(2)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    )
}

const borderlessTable = {
    borderCollapse: 'collapse',
    border: 'none',
};


export default Today