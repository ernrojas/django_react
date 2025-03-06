import React from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { mockBarData as data } from "../data/mockData";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // 6 series, una por cada clave (hot dog, burger, sandwich, kebab, fries, donut)
  const series = [
    {
      name: "hot dog",
      data: data.map((d) => d["hot dog"] || 0),
    },
    {
      name: "burger",
      data: data.map((d) => d.burger || 0),
    },
    {
      name: "sandwich",
      data: data.map(() => 0), // no existe en mockBarData
    },
    {
      name: "kebab",
      data: data.map((d) => d.kebab || 0),
    },
    {
      name: "fries",
      data: data.map(() => 0), // no existe en mockBarData
    },
    {
      name: "donut",
      data: data.map((d) => d.donut || 0),
    },
  ];

  // Eje X con países
  const categories = data.map((d) => d.country);

  // Un color por cada serie (para que la leyenda coincida)
  const apexColors = [
    "hsl(27, 61%, 76.9%)", // hot dog
    "hsl(9, 87.1%, 66.7%)", // burger
    "hsl(0, 0%, 60%)",    // sandwich (placeholder)
    "hsl(38, 79.3%, 56.5%)",  // kebab
    "hsl(60, 70%, 50%)",  // fries (placeholder)
    "hsl(169, 57.6%, 74.1%)", // donut
  ];

  // Para modo claro, oscurecemos texto y líneas a #666
  // En modo oscuro, seguimos usando el gris claro de tokens.
  const axisTextColor =
    theme.palette.mode === "dark" ? colors.grey[100] : "#666";

  // Hacemos lo mismo con el color de las líneas del grid
  const gridColor =
    theme.palette.mode === "dark" ? colors.grey[100] : "#666";

  // Títulos de ejes condicionales
  const xAxisTitle = isDashboard ? "" : "country";
  const yAxisTitle = isDashboard ? "" : "food";

  const options = {
    chart: {
      type: "bar",
      background: "transparent",
      stacked: true,
    },
    colors: apexColors,
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    xaxis: {
      categories,
      title: {
        text: xAxisTitle,
        style: {
          color: axisTextColor,
        },
      },
      labels: {
        style: {
          // array de colores (uno por categoría)
          colors: categories.map(() => axisTextColor),
        },
      },
      axisBorder: {
        show: true,
        color: axisTextColor,
      },
      axisTicks: {
        show: true,
        color: axisTextColor,
      },
    },
    yaxis: {
      title: {
        text: yAxisTitle,
        style: {
          color: axisTextColor,
        },
      },
      labels: {
        style: {
          colors: [axisTextColor],
        },
      },
    },
    legend: {
      position: "right",
      labels: {
        colors: axisTextColor,
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      y: {
        formatter: (value, { seriesIndex, dataPointIndex, w }) => {
          const seriesName = w.globals.seriesNames[seriesIndex];
          const countryName = categories[dataPointIndex];
          return `${seriesName}: ${value} in country: ${countryName}`;
        },
      },
    },
    // Ajustamos el color de las líneas punteadas
    grid: {
      borderColor: gridColor,
      strokeDashArray: 3,
    },
  };

  return (
    <div style={{ width: "100%", height: "100%", margin: 0, padding: 0 }}>
      {/* Inyectamos estilos extra SOLO en modo oscuro */}
      {theme.palette.mode === "dark" && (
        <style>
          {`
            /* Forzamos el estilo del menú de exportación en ApexCharts */
            .apexcharts-menu.open {
              background-color: #333 !important;
              border: 1px solid #444 !important;
            }
            .apexcharts-menu-item {
              color: #fff !important;
              background-color: #999 !important;
            }
            .apexcharts-menu-item:hover {
              background-color: #444 !important;
            }
          `}
        </style>
      )}
      <Chart
        options={options}
        series={series}
        type="bar"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default BarChart;
