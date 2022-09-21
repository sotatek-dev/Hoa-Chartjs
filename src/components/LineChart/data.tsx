export const data = {
    labels: ["1970", "1980", "1990", "2000", "2010", "2020"],
    datasets: [
        {
            label: "Visitors",
            data: [80, 90, 70, 30, 40, 20],
            borderColor: "rgb(0,162,255)",
            pointBackgroundColor: "rgb(0,162,255)",
            backgroundColor: "rgb(0,162,255,0.2)",
            yAxisID: "y",
            order: 1
        },
        {
            label: "Sales",
            data: [20, 40, 60, 90, 20, 50],
            pointBackgroundColor: "rgb(20,245,132)",
            borderColor: "rgb(20,245,132)",
            backgroundColor: "rgb(20,245,132,0.2)",
            yAxisID: "y1",
            order: 2
        },
        {
            label: "Customers",
            data: [45, 25, 55, 65, 15, 30],
            pointBackgroundColor: "rgb(255,179,3)",
            borderColor: "rgb(255,179,3)",
            backgroundColor: "rgb(255,179,3,0.2)",
            yAxisID: "y",
            order: 3
        },
        {
            label: "Returning customers",
            data: [75, 50, 40, 15, 80, 10],
            pointBackgroundColor: "rgb(92,57,255)",
            borderColor: "rgb(92,57,255)",
            backgroundColor: "rgb(92,57,255,0.2)",
            yAxisID: "y1",
            order: 4
        }
    ]
}
