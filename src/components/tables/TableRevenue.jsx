// app/Stats/TableRevenue

//dependencies
import moment from 'moment'

//components

function TableRevenue({data}) {

    //variables
    const arr = data.sort((a, b) => moment(b.date) - moment(a.date));

    //functions
    const cash = data.filter

    //effects

    return (
        <div>
            <table cellspacing='0'>
                <thead>
                    <tr style={{fontWeight:500}}>
                        <td style={{textAlign:'left'}}><i>Date</i></td>
                        <td style={{backgroundColor:'#ea4335', color:'white'}}>Billed</td>
                        <td style={{backgroundColor:'#DDA703', color:'white'}}>Credit</td>
                        <td style={{backgroundColor:'#fbbc05', color:'white'}}>Cash</td>
                        <td style={{backgroundColor:'#34a853', color:'white'}}>Tips</td>
                        <td style={{backgroundColor:'#4285f4', color:'white'}}>TABS</td>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry) => 
                        <tr key={entry.date} style={moment(entry.date).format('D') % 2 == 0 ? {backgroundColor:'whitesmoke'} : {}}>
                            <td style={{textAlign:'left'}}><i>{entry.date}</i></td>
                            <td>$ {entry.orders == 0 ? '' : entry.orders.toFixed(2)}</td>
                            <td>$ {entry.payments == 0 ? '' : entry.credit.toFixed(2)}</td>
                            <td>$ {entry.payments == 0 ? '' : entry.cash.toFixed(2)}</td>
                            <td>$ {entry.tips == 0 ? '' : entry.tips.toFixed(2)}</td>
                            <td>$ {entry.balance.toFixed(2)}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )

}

export default TableRevenue
