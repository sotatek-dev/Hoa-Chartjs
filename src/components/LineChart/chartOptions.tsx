import { Chart, TooltipItem, TooltipModel } from "chart.js";
const getOrCreateTooltip = (chart: any) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
        tooltipEl.style.borderRadius = '3px';
        tooltipEl.style.color = 'white';
        tooltipEl.style.opacity = 1;
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.transform = 'translate(-50%, 0)';
        tooltipEl.style.transition = 'all .1s ease';

        const table = document.createElement('table');
        table.style.margin = '0px';

        tooltipEl.appendChild(table);
        chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
};
export const options = {
    animation: {
        delay: (context: any) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default') {
                delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
        }
    },
    transitions: {
        show: {
            animations: {
                y: {
                    from: 650,
                    duration: 2000,
                }
            },
        },
        hide: {
            animation: {
                duration: 0
            }
        }
    },
    elements: {
        point: {
            radius: 8,
            borderWidth: 2,
            hoverRadius: 12,
            pointBorderColor: "#fff",
        }
    },
    plugins: {
        title: {
            display: false
        },
        tooltip: {
            interaction: {
                mode: "index" as const,
                intersect: false
            },
            callbacks: {
                label: function (tooltipItems: TooltipItem<"line">) {
                    if (tooltipItems.dataset.yAxisID === 'y') {
                        return tooltipItems.dataset.label + ' ' + tooltipItems.formattedValue
                    } else {
                        return `${tooltipItems.dataset.label} $${tooltipItems.formattedValue}`
                    }
                }
            },
            enabled: false,
            external: (context: { chart: Chart, tooltip: TooltipModel<"line"> }) => {
                const { chart, tooltip } = context;
                const tooltipEl = getOrCreateTooltip(chart);
                tooltipEl.classList.add('tooltip');

                // Hide if no tooltip
                if (tooltip.opacity === 0) {
                    tooltipEl.style.opacity = 0;
                    return;
                }

                // // Set Text
                if (tooltip.body) {
                    const titleLines = tooltip.title || [];
                    const bodyLines = tooltip.body.map(b => b.lines);

                    const tableHead = document.createElement('thead');

                    titleLines.forEach(title => {
                        const tr = document.createElement('tr');
                        const th = document.createElement('th');
                        const text = document.createTextNode(title);

                        th.appendChild(text);
                        tr.appendChild(th);
                        tableHead.appendChild(tr);
                    });

                    const tableBody = document.createElement('tbody');
                    tableBody.style.backgroundColor = "#fff";
                    bodyLines.forEach((body, i) => {
                        const colors = tooltip.labelColors[i];

                        const span = document.createElement('span');
                        span.classList.add('tooltip__body-text')
                        span.style.background = colors.backgroundColor + '';
                        span.style.borderColor = colors.borderColor + '';

                        const tr = document.createElement('tr');
                        const td = document.createElement('td');

                        const textNormal = body[0].substring(0, body[0].lastIndexOf(" ")) + " ";
                        const textBold = body[0].split(" ").pop() || '';
                        const textNormalElement = document.createTextNode(textNormal.toString());
                        const textBoldElement = document.createTextNode(textBold.toString());
                        const strong = document.createElement('strong');
                        const textSpan = document.createElement('span');
                        strong.appendChild(textBoldElement);
                        textSpan.appendChild(textNormalElement);
                        textSpan.appendChild(strong);
                        textSpan.style.marginRight = '8px';

                        td.appendChild(span);
                        td.appendChild(textSpan);
                        tr.appendChild(td);
                        tableBody.appendChild(tr);
                    });

                    const tableRoot = tooltipEl.querySelector('table');
                    // Remove old children
                    while (tableRoot.firstChild) {
                        tableRoot.firstChild.remove();
                    }
                    // Add new children
                    tableRoot.appendChild(tableHead);
                    tableRoot.appendChild(tableBody);
                }

                const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

                // Display, position
                tooltipEl.style.opacity = 1;
                tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                tooltipEl.style.top = positionY + tooltip.caretY + 'px';
            },
        },
        legend: {
            labels: {
                usePointStyle: true,
                pointStyle: "circle",
            },
            position: "bottom" as const,
        },
        zoom: {
            zoom: {
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true
                },
                mode: 'x' as const,
            }
        }
    },
    tension: 0.3,
    fill: true,
    scales: {
        x: {
            grid: {
                display: false,
                drawBorder: false,
            },
            ticks: {
                color: "#ccc",
            },
        },
        y: {
            position: "left" as const,
            grid: {
                display: false,
                drawBorder: false,
            },
            ticks: {
                color: "#ccc",
                stepSize: 30,
                padding: 20
            },
            beginAtZero: true,
            max: 90,
        },
        y1: {
            position: "right" as const,
            grid: {
                drawOnChartArea: false,
                display: false,
                drawBorder: false,
            },
            ticks: {
                color: "#ccc",
                stepSize: 30,
                padding: 20,
                callback: function (value: any) {
                    return "$" + value;
                }
            },
            beginAtZero: true,
            max: 90,

        }
    }
}