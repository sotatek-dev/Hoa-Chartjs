export const options = {
    animation: {
        duration: 1000,
        easing: "easeInQuad" as const,
        onComplete: function (chart: any) {
            // console.log(chart);
        }
    },
    elements: {
        point: {
            radius: 8,
            borderWidth: 2,
            hoverRadius: 12,
            pointBorderColor: "#fff"
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
            titleColor: "#000",
            titleFont: { weight: "normal" },
            backgroundColor: "#fff",
            bodyColor: "#000",
            usePointStyle: true,
            callbacks: {
                labelPointStyle: function () {
                    return {
                        pointStyle: 'circle' as const,
                        rotation: 0
                    };
                },

            }
        },
        legend: {
            labels: {
                usePointStyle: true,
                pointStyle: "circle"
            },
            position: "bottom" as const,
            // disible click action
            // onClick: function (event: any, legendItem: any, legend: any) {
            //     console.log(event);
            //     console.log(legendItem);
            //     console.log(legend);
            // },
            // onHover: function (e: any) {
            //     e.target.style.cursor = 'pointer';
            // }
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
            }
        },
        y: {
            position: "left" as const,
            grid: {
                display: false,
                drawBorder: false,
            },
            min: 0,
            ticks: {
                stepSize: 30,
                padding: 20
            },
        },
        y1: {
            position: "right" as const,
            grid: {
                drawOnChartArea: false,
                display: false,
                drawBorder: false,
            },
            ticks: {
                stepSize: 30,
                padding: 20,
                callback: function (value: any) {
                    return "$" + value;
                }
            },
            min: 0
        }
    }
}