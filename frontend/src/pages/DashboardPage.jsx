import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import ReviewTable from "../components/ReviewTable";
import PageTransition from "../components/PageTransition";
import api from "../utils/api";

const DashboardPage = () => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ totalReviews: 0, averageScore: 0, bestScore: 0, worstScore: 0 });

  useEffect(() => {
    const run = async () => {
      const [{ data: reviewsData }, { data: analyticsData }] = await Promise.all([
        api.get("/reviews"),
        api.get("/analytics")
      ]);
      setReviews(reviewsData.reviews || []);
      setSummary(analyticsData.summary || summary);
    };

    run().catch(() => {});
  }, []);

  return (
    <PageTransition>
      <div className="space-y-5">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total Reviews" value={summary.totalReviews} />
          <MetricCard label="Average Score" value={`${summary.averageScore}/100`} accent="from-cyan-400 to-sky-500" />
          <MetricCard label="Best Score" value={summary.bestScore} accent="from-emerald-400 to-teal-500" />
          <MetricCard label="Worst Score" value={summary.worstScore} accent="from-amber-400 to-orange-500" />
        </section>

        <section className="glass-card rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Reviews</h2>
            <Link to="/app/review" className="rounded-xl bg-brand-primary px-3 py-1 text-sm text-white">New Review</Link>
          </div>
          <ReviewTable reviews={reviews.slice(0, 6)} />
        </section>
      </div>
    </PageTransition>
  );
};

export default DashboardPage;

