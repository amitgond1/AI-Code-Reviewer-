import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const COLORS = ["#4F46E5", "#06B6D4", "#334155"];

const ScoreRadial = ({ score = 0 }) => {
  const data = [
    { name: "score", value: score },
    { name: "rest", value: 100 - score }
  ];

  return (
    <div className="glass-card rounded-2xl p-4">
      <p className="mb-3 text-sm text-slate-400">Code Quality Score</p>
      <div className="relative h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={55} outerRadius={75} dataKey="value" startAngle={90} endAngle={-270}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-3xl font-extrabold">{score}</p>
        </div>
      </div>
      <p className="text-center text-sm text-slate-300">/ 100</p>
    </div>
  );
};

export default ScoreRadial;
