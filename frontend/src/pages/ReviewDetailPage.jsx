import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import ReviewResultCards from "../components/ReviewResultCards";
import ScoreRadial from "../components/ScoreRadial";
import ComplexityChart from "../components/ComplexityChart";
import api from "../utils/api";

const ReviewDetailPage = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/review/${id}`)
      .then(({ data }) => setReview(data.review))
      .finally(() => setLoading(false));
  }, [id]);

  const downloadPdf = async () => {
    const res = await api.get(`/review/${id}/export`, { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `review-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <p className="text-slate-300">Loading review...</p>;
  }

  if (!review) {
    return <p className="text-red-300">Review not found.</p>;
  }

  return (
    <PageTransition>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Review Result</h1>
          <button onClick={downloadPdf} className="rounded-xl bg-brand-primary px-4 py-2 text-sm text-white">
            Export PDF
          </button>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <ScoreRadial score={review.score} />
          <div className="xl:col-span-2">
            <ComplexityChart
              timeComplexity={review.time_complexity}
              spaceComplexity={review.space_complexity}
            />
          </div>
        </div>

        <ReviewResultCards review={review} />
      </div>
    </PageTransition>
  );
};

export default ReviewDetailPage;

