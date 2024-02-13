import React from 'react';
import { ResponsiveLine } from '@nivo/line';

const VisitsChart = ({ data }) => {
    return (
        <div style={{ height: '400px' }}>
            <ResponsiveLine
                data={[
                    {
                        id: 'Посещения',
                        data: Object.entries(data).map(([date, value]) => ({
                            x: date,
                            y: value,
                        })),
                    },
                ]}
                margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                }}
                colors={{ scheme: 'nivo' }}
                pointSize={10}
                pointColor={{ from: 'color', modifiers: [] }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabel="y"
                pointLabelYOffset={-12}
                enableArea={true}
                areaOpacity={0.3}
                enableGridX={false}
                enableGridY={true}
                enableSlices="x"
                sliceTooltip={({ slice }) => {
                    return (
                        <div
                            style={{
                                background: 'white',
                                padding: '9px 12px',
                                border: '1px solid #ccc',
                                borderRadius: '3px',
                            }}
                        >
                            <div><strong>{slice.points[0].data.xFormatted}</strong></div>
                            {slice.points.map(point => (
                                <div
                                    key={point.id}
                                    style={{
                                        color: point.serieColor,
                                        padding: '3px 0',
                                    }}
                                >
                                    <strong>{point.serieId}:</strong> {point.data.yFormatted}
                                </div>
                            ))}
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default VisitsChart;
