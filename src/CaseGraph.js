import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import { urlSelector } from "./utils";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function CaseGraph({ countryCode, casesType }) {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      await fetch(urlSelector(countryCode))
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          var chartData = null;
          if(countryCode === "worldwide"){
            chartData = buildChartData(data, casesType);
          } else{
            chartData = buildChartData(data.timeline, casesType);
          }
          setData(chartData);

        });
    };
    fetchData();
    
  }, [countryCode, casesType]);

  return (
    <div>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgb(0, 0, 255)",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default CaseGraph;
