import React, { useRef, useEffect, useState } from "react";
import type { ChartData, ChartArea } from "chart.js";
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
import { Line } from "react-chartjs-2";
import zoomPlugin from 'chartjs-plugin-zoom';
import { data, datasets } from './data';
import { options } from './chartOptions'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
	zoomPlugin
);

function createGradient(color: string, ctx: CanvasRenderingContext2D, area: ChartArea) {
	const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
	gradient.addColorStop(0, "rgb(255,255,255,0.05)");
	gradient.addColorStop(0.5, 'rgb(255,255,255,0.05)');
	gradient.addColorStop(1, color);
	return gradient;
}

const plugins = [
	{
		id: "draw-line",
		afterDraw: (chart: { tooltip?: any; scales?: any; ctx?: any, chartArea: ChartArea }) => {
			const { tooltip, scales, ctx } = chart;
			if (tooltip._active && tooltip._active.length) {
				const activePoint = tooltip._active[0];
				const { x } = activePoint.element;
				const topY = scales.y.top;
				const bottomY = scales.y.bottom;
				// console.log("chart", scales.x);

				// draw vertical line
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth = 1;
				ctx.strokeStyle = "#ccc";
				ctx.setLineDash([10, 10]);
				ctx.moveTo(x, topY);
				ctx.lineTo(x, bottomY);
				ctx.stroke();
				ctx.restore();
				// draw horizontal line
				// ctx.save();
				// ctx.lineWidth = 1;
				// ctx.strokeStyle = "#ccc";
				// ctx.setLineDash([5, 5]);
				// ctx.strokeRect(chartArea.left, activePoint.element.y, chartArea.width, 0)
				// ctx.stroke();
				// ctx.restore();

				// draw tooltip
				ctx.save();
				ctx.strokeStyle = "#ccc";
				ctx.fillStyle = "rgb(236,239,241)";
				ctx.fillRect(x - 30, bottomY + 10, 60, 25);
				ctx.restore();
				ctx.font = "10pt Open Sans";
				ctx.fillText(data.labels[activePoint.index], x - 15, bottomY + 23);

				ctx.save();
				ctx.beginPath();
				ctx.lineWidth = 0.2;
				ctx.strokeStyle = "#000";
				ctx.rect(x - 30, bottomY + 10, 60, 25);
				ctx.stroke();
				ctx.restore();
			}
		}
	}
];


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
			datasets: data.datasets.map((dataset, index) => ({
				...dataset,
				backgroundColor: createGradient(dataset.backgroundColor, chart.ctx, chart.chartArea),
				data: datasets[index].data,
				order: index
			}))
		};
		setChartData(chartData);
	}, []);

	return (
		<Line
			id="canvas"
			ref={chartRef}
			options={options}
			data={chartData}
			plugins={plugins}
		/>
	);
}
