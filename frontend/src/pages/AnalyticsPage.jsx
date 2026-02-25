import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import PageTransition from "../components/PageTransition";
import MetricCard from "../components/MetricCard";
import api from "../utils/api";

const palette = ["#4F46E5", "#06B6D4", "#22C55E", "#F59E0B", "#EF4444", "#A855F7"];

const AnalyticsPage = () => {
  const [data, setData] = useState({
    summary: { totalReviews: 0, averageScore: 0, bestScore: 0, worstScore: 0 },
    reviewsPerDay: [],
    languagesUsed: []
  });

  useEffect(() => {
    api.get("/analytics").then(({ data: payload }) => setData(payload)).catch(() => {});
  }, []);

  return (
    <PageTransition>
      <div className="space-y-5">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Reviews" value={data.summary.totalReviews} />
          <MetricCard label="Average Score" value={data.summary.averageScore} accent="from-cyan-400 to-sky-500" />
          <MetricCard label="Best Score" value={data.summary.bestScore} accent="from-emerald-400 to-teal-500" />
          <MetricCard label="Worst Score" value={data.summary.worstScore} accent="from-amber-400 to-orange-500" />
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <div className="glass-card rounded-2xl p-4">
            <h2 className="mb-3 font-semibold">Reviews per Day</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.reviewsPerDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <h2 className="mb-3 font-semibold">Languages Used</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.languagesUsed} dataKey="count" nameKey="language" outerRadius={100} label>
                    {data.languagesUsed.map((entry, index) => (
                      <Cell key={entry.language} fill={palette[index % palette.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default AnalyticsPage;
