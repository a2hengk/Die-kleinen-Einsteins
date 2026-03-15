import React from "react";

type DonutChartProps = {
  data: number[];
  size?: number;
  strokeWidth?: number;
  colors?: string[];
};

export default function DonutChart({
  data = [10, 5],
  size = 200,
  strokeWidth = 20,
  colors = ["#5ACF67", "#ED8585", "#81A9FF"],
}: DonutChartProps) {
  const total = data.reduce((acc, val) => acc + val, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {data.map((value, index) => {
          const percent = value / total;
          const strokeDasharray = `${percent * circumference} ${circumference}`;
          const strokeDashoffset = -cumulativePercent * circumference;

          cumulativePercent += percent;

          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={colors[index % colors.length]}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="butt"
            />
          );
        })}
      </g>
    </svg>
  );
}
