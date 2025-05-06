import React, { useState, useEffect } from "react";
import CustomChart from "./custom/CustomChart";
import { div } from "framer-motion/client";

const PortalChartExample: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [emptyMessage, setEmptyMessage] = useState("No data available.");

  // Sample chart options for a Line chart
  const chartOptions = {
    title: {
      text: "",
    },
    series: [
      {
        name: "Series 1",
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        type: "column",
        color: "#2e76f3",
        borderWidth: 0,
        animation: false, // Disable animation for this series
      },
      {
        name: "Series 2",
        data: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        type: "column",
        color: "#a0bef2",
        borderWidth: 0,
        animation: false, // Disable animation for this series
      },
    ],
    xAxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
      ],
    },
    yAxis: {
      title: {
        text: "Value",
      },
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        animation: false, // Disable animation for all columns
      },
    },
    chart: {
      animation: false, // Disable all chart animations
    },
  };

  useEffect(() => {
    setTimeout(() => {
      setChartData(chartOptions);
      setIsLoading(false);
    }, 8000);
  }, []);

  return (
    <CustomChart
      options={chartData}
      title="Data Overview"
      className="chart-container"
      theme="light"
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyMessage={emptyMessage}
    />
  );
};

export default PortalChartExample;
