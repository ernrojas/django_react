import React from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const mockPieData = [
  { id: "hack", label: "hack", value: 239 },
  { id: "make", label: "make", value: 170 },
  { id: "go", label: "go", value: 322 },
  { id: "lisp", label: "lisp", value: 503 },
  { id: "scala", label: "scala", value: 584 },
];

const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const series = mockPieData.map((item) => item.value);
  const labels = mockPieData.map((item) => item.label);

  const apexColors = [
    "hsl(27, 61%, 76.9%)",
    "hsl(9, 87.1%, 66.7%)",
    "hsl(38, 79.3%, 56.5%)",
    "hsl(60, 70%, 50%)",
    "hsl(169, 57.6%, 74.1%)",
  ];

  const strokeColorDark = "#141b2d";
  const strokeColorLight = "#fff";

  const options = {
    chart: {
      type: "donut",
      background: "transparent",
      toolbar: {
        show: true,
        tools: {
          download: true,    // permite descargar SVG, PNG, CSV
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },
    labels,
    colors: apexColors,
    stroke: {
      colors: [theme.palette.mode === "dark" ? strokeColorDark : strokeColorLight],
      width: 6,
    },
    states: {
      active: {
        filter: {
          type: "none",
          value: 0,
        },
        stroke: {
          color: theme.palette.mode === "dark" ? strokeColorDark : strokeColorLight,
          width: 5,
        },
        scale: 1.1,
      },
    },
    legend: {
      position: "bottom",
      fontSize: "14px",
      labels: {
        colors: Array(labels.length).fill(colors.grey[100]),
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
        },
      },
    },
    dataLabels: {
      style: {
        fontSize: "14px",
        // color de los números dentro de la dona (no es el tooltip)
        colors: [colors.primary[500]],
      },
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      // evita que el tooltip adopte el color de la serie
      fillSeriesColor: false,
      container: {
        color: colors.primary[500],
      },
      // estilo claro (opcional)
      //theme: "light",
      // también podrías forzar un fondo neutro
      // container: {
      //   background: "#fff",
      // },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "70vh",
        minHeight: "400px",
        marginBottom: "20px",
      }}
    >
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
      <Chart options={options} series={series} type="donut" width="100%" height="100%" />
    </div>
  );
};

export default PieChart;
