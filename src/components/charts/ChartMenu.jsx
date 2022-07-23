// app/Menu/ChartMenu

//dependencies
import React, { useState, useEffect } from "react";
import moment from "moment";

//chartJS stuff
import "chart.js/auto";
import { Chart, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title
} from "chart.js";
ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title);

function ChartMenu({data, item}) {

  const empty = {
    labels: ['past', 'future'],
    datasets: [
      {
        label:'',
        data: [10,15],
      }
    ]
  }

  const [chartData, setChartData] = useState(empty)

  useEffect(() => {
    setChartData({
      labels: data.map((entry) => entry.date),
      datasets: [
        {
          label: item,
          type: 'bar',
          data: data.map((entry) => entry.count),
          backgroundColor: [
            "rgba(0, 204, 102, 1)" //green
          ],
        },
      ],
    });
  }, [data]);


  return (
    <div style={{position:'relative'}}>
      <Chart type="bar" data={chartData} height="175px"/>
    </div>
  )
}

export default ChartMenu
