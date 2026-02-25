import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getComplexitySeverity } from "../utils/helpers";

const levelToValue = {
  Low: 30,
  Medium: 65,
  High: 95
};

const ComplexityChart = ({ timeComplexity = "O(1)", spaceComplexity = "O(1)" }) => {
  const timeLevel = getComplexitySeverity(timeComplexity);
  const spaceLevel = getComplexitySeverity(spaceComplexity);

  const data = [
    { name: "Time", level: timeLevel, value: levelToValue[timeLevel] },
    { name: "Space", level: spaceLevel, value: levelToValue[spaceLevel] }
  ];

  return (
    <div className="glass-card rounded-2xl p-4">
      <p className="mb-3 text-sm text-slate-400">Complexity Visualization</p>
      <div className="mb-3 grid gap-2 text-sm sm:grid-cols-2">
        <p>Time Complexity: <span className="font-semibold">{timeComplexity}</span></p>
        <p>Space Complexity: <span className="font-semibold">{spaceComplexity}</span></p>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComplexityChart;
