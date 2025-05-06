import React, { ReactNode, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import CustomChartState from "./CustomChartState";

// Dynamically load required Highcharts modules
const loadHighchartsModules = async () => {
  await Promise.all([
    import("highcharts/modules/exporting"),
    import("highcharts/modules/export-data"),
  ]);
};

interface CustomChartProps {
  options: Highcharts.Options | null; // Ensure options is nullable
  className?: string;
  title?: string;
  theme?: "light" | "dark";
  children?: ReactNode;
  childrenBottom?: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export const CustomChart: React.FC<CustomChartProps> = ({
  options,
  title,
  className = "",
  theme = "light",
  children,
  childrenBottom,
  isLoading = false,
  isEmpty = false,
  emptyMessage,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadHighchartsModules().then(() => {
      setIsLoaded(true);
    });
  }, []);

  if (!options) {
    // If options are null, return a loading or empty state
    return (
      <CustomChartState
        title={title}
        className={className}
        theme={theme}
        type="loading"
        message="Chart options are not available."
      />
    );
  }

  // Apply theme-specific styles
  const isDark = theme === "dark";
  const textColor = isDark ? "#F8F8F8" : "#222222";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)";
  const tooltipBackground = isDark
    ? "rgba(0, 0, 0, 0.9)"
    : "rgba(255, 255, 255, 0.95)";
  const tooltipTextColor = isDark ? "#FFFFFF" : "#222222";
  const legendTextColor = isDark ? "#F0F0F0" : "#222222";
  const borderColor = isDark ? "#2C2C2C" : "#E0E0E0";

  const defaultOptions: Highcharts.Options = {
    chart: {
      backgroundColor: "transparent",
      borderRadius: 10,
      spacing: [20, 20, 20, 20],
      style: { fontFamily: "Inter, sans-serif" },
      zooming: { type: "x" }, // Enables zooming on X-axis
      panning: {
        enabled: true,
        type: "x",
      },
      resetZoomButton: {
        theme: {
          fill: "#666",
          stroke: "#000",
          style: { color: "#fff" },
        },
      },
    },
    title: {
      text: options.title?.text || "",
      align: "left",
      margin: 28,
      style: {
        color: textColor,
        fontSize: "14px",
        fontWeight: "semibold",
      },
    },
    xAxis: {
      labels: {
        style: { color: textColor },
      },
      gridLineColor: gridColor,
    },
    yAxis: Array.isArray(options.yAxis)
      ? options.yAxis.map((axis) => ({
          ...axis,
          labels: {
            style: {
              color: "#333",
              fontSize: "14px",
              fontWeight: "medium",
            },
          },
          title: {
            style: { color: "#333", fontSize: "14px", fontWeight: "medium" },
          },
          gridLineColor: gridColor,
        }))
      : {
          labels: {
            style: {
              color: "#333", // Bright white labels
              fontSize: "14px",
              fontWeight: "medium",
            },
          },
          title: {
            style: { color: "#333", fontSize: "14px", fontWeight: "medium" },
          },
          gridLineColor: gridColor,
        },
    legend: {
      itemStyle: {
        color: legendTextColor,
        fontSize: "13px",
        fontWeight: "medium",
      },
      itemHoverStyle: { color: isDark ? "#FFD700" : "#000000" }, // Gold for dark mode hover
      itemHiddenStyle: { color: isDark ? "#555555" : "#CCCCCC" }, // Dim for hidden items
    },
    tooltip: {
      shared: true,
      useHTML: true,
      backgroundColor: tooltipBackground,
      style: { color: tooltipTextColor, fontSize: "12px" },
      borderRadius: 8,
      borderColor: borderColor,
      formatter: function (this: any) {
        let tooltip = `<b style="font-size:14px">${this.x}</b><br/>`;
        this.points.forEach((point: any) => {
          tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y}</b><br/>`;
        });
        return tooltip;
      },
    },
    plotOptions: {
      series: {
        marker: { enabled: false },
        dataLabels: {
          enabled: false, // Hides values on each point
          style: { fontSize: "12px", color: textColor, textOutline: "none" },
        },
      },
    },
    exporting: {
      enabled: true, // Enables the export button
      allowHTML: true, // Ensure tooltip & exporting work properly
      buttons: {
        contextButton: {
          menuItems: [
            "downloadPNG",
            "downloadJPEG",
            "downloadPDF",
            "downloadSVG",
            "separator",
            "downloadCSV",
            "downloadXLS",
            "viewData",
          ],
        },
      },
    },
    colors: isDark
      ? ["#4CAF50", "#FF9800", "#03A9F4", "#E91E63"]
      : ["#007BFF", "#28A745", "#FFC107", "#DC3545"],
  };

  const mergedOptions = Highcharts.merge(defaultOptions, options);

  // Loading state
  if (isLoading) {
    return (
      <CustomChartState
        title={title}
        className={className}
        theme={theme}
        type="loading"
        message="Loading chart data..."
      />
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <CustomChartState
        title={title}
        className={className}
        theme={theme}
        type="empty"
        message={emptyMessage || "No chart data available"}
      />
    );
  }

  // Highcharts loading state
  if (!isLoaded) {
    return (
      <CustomChartState
        title={title}
        className={className}
        theme={theme}
        type="initializing"
        message="Initializing chart..."
      />
    );
  }

  return (
    <div className={`${className}`}>
      {title ? <div className="p-4 font-medium text-lg">{title}</div> : null}
      {children ? children : null}
      <HighchartsReact highcharts={Highcharts} options={mergedOptions} />
      {childrenBottom ? childrenBottom : null}
    </div>
  );
};

export default CustomChart;
