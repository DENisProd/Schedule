import React, {useEffect} from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ data, labels }) => {
    // ScaleRegistry.addScales({
    //     category: {
    //         type: 'category',
    //         labels: ['January', 'February', 'March', 'April', 'May', 'June']
    //     }
    // });

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Number of Visitors",
                backgroundColor: "rgba(75,192,192,1)",
                borderColor: "rgba(0,0,0,1)",
                borderWidth: 2,
                data: data,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                type: 'category',
                labels: labels,
            },
        },
    };

    return (
        <div>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default BarChart;