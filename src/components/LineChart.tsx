import React, { MouseEvent, useRef, useEffect, useState } from "react";
import type { InteractionItem, ChartData, ChartArea } from "chart.js";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler
} from "chart.js";
import { Line, getDatasetAtEvent, getElementAtEvent } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

const labels = ["1970", "1980", "1990", "2000", "2010", "2020"];
const colors = [
	"rgb(0,162,255,0.05)",
	"rgb(20,245,132,0.05)",
	"rgb(255,179,3,0.05)",
	"rgb(92,57,255,0.05)"
];
const data = {
	labels,
	datasets: [
		{
			label: "Visitors",
			data: [80, 90, 70, 30, 40, 20],
			borderColor: "rgb(0,162,255)",
			yAxisID: "y",
		},
		{
			label: "Sales",
			data: [20, 40, 60, 90, 20, 50],
			borderColor: "rgb(20,245,132)",
			yAxisID: "y1",
		},
		{
			label: "Customers",
			data: [45, 25, 55, 65, 15, 30],
			borderColor: "rgb(255,179,3)",
			yAxisID: "y",
		},
		{
			label: "Returning customers",
			data: [75, 50, 40, 15, 80, 10],
			borderColor: "rgb(92,57,255)",
			yAxisID: "y1",
		}
	]
};

const options = {
	plugins: {
		title: {
			display: false
		},
		tooltip: {
			interaction: {
				mode: "index" as const,
				intersect: false
			},
			titleColor: "rgba(22, 88, 235)",
			backgroundColor: "#fff",
			bodyColor: "#000"
		},
		legend: {
			labels: {
				usePointStyle: true,
				pointStyle: "circle"
			},
			position: "bottom" as const
			// disible click action
			// onClick: function () {}
		}
	},
	tension: 0.3,
	fill: true,
	scales: {
		x: {
			grid: {
				display: false
			}
		},
		y: {
			position: "left" as const,
			grid: {
				display: false
			}
		},
		y1: {
			position: "right" as const,
			grid: {
				drawOnChartArea: false
			},
			ticks: {
				callback: function (value: any, index: Number) {
					return "$" + value;
				}
			}
		}
	}
};

function createGradient(ctx: CanvasRenderingContext2D, area: ChartArea) {
	const colorStart = colors[Math.floor(Math.random() * colors.length)];
	const colorEnd = colors[Math.floor(Math.random() * colors.length)];
	const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
	gradient.addColorStop(0, "rgb(255,255,255,0.05)");
	gradient.addColorStop(0.5, colorStart);
	gradient.addColorStop(1, colorEnd);
	return gradient;
}

export function LineChartComponent() {
	const chartRef = useRef<ChartJS<"line", number[], string>>(null);
	const [chartData, setChartData] = useState<ChartData<"line">>({
		datasets: []
	});

	useEffect(() => {
		const chart = chartRef.current;
		if (!chart) {
			return;
		}
		const chartData = {
			...data,
			datasets: data.datasets.map((dataset) => ({
				...dataset,
				backgroundColor: createGradient(chart.ctx, chart.chartArea)
			}))
		};
		setChartData(chartData);
	}, []);

	const printDatasetAtEvent = (dataset: InteractionItem[]) => {
		if (!dataset.length) return;
		const datasetIndex = dataset[0].datasetIndex;
		console.log(data.datasets[datasetIndex].label);
	};

	const printElementAtEvent = (element: InteractionItem[]) => {
		if (!element.length) return;
		const { datasetIndex, index } = element[0];
		console.log(data.labels[index], data.datasets[datasetIndex].data[index]);
	};

	const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
		const { current: chart } = chartRef;
		if (!chart) {
			return;
		}
		printDatasetAtEvent(getDatasetAtEvent(chart, event));
		printElementAtEvent(getElementAtEvent(chart, event));
	};

	const plugins = [
		{
			id: "draw-line",
			afterDraw: (chart: { tooltip?: any; scales?: any; ctx?: any }) => {
				if (chart.tooltip._active && chart.tooltip._active.length) {
					const activePoint = chart.tooltip._active[0];
					const { ctx } = chart;
					const { x } = activePoint.element;
					const topY = chart.scales.y.top;
					const bottomY = chart.scales.y.bottom;
					// draw vertical line
					ctx.save();
					ctx.beginPath();
					ctx.moveTo(x, topY);
					ctx.lineTo(x, bottomY);
					ctx.lineWidth = 1;
					ctx.strokeStyle = "#ccc";
					ctx.stroke();
					ctx.restore();
				}
			}
		}
	];
	return (
		<Line
			id="canvas"
			ref={chartRef}
			options={options}
			data={chartData}
			onClick={onClick}
			plugins={plugins}
		/>
	);
}
