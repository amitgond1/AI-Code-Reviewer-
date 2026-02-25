import { useEffect, useState } from "react";
import ReviewTable from "../components/ReviewTable";
import PageTransition from "../components/PageTransition";
import api from "../utils/api";

const ReviewHistoryPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/reviews");
      setReviews(data.reviews || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const deleteReview = async (id) => {
    await api.delete(`/review/${id}`);
    load().catch(() => {});
  };

  return (
    <PageTransition>
      <div className="glass-card rounded-2xl p-5">
        <h1 className="mb-4 text-xl font-bold">Review History</h1>
        {loading ? (
          <p className="text-slate-300">Loading...</p>
        ) : (
          <>
            <ReviewTable reviews={reviews} />
            {!!reviews.length && (
              <div className="mt-4 flex flex-wrap gap-2">
                {reviews.slice(0, 8).map((r) => (
                  <button
                    key={r._id}
                    onClick={() => deleteReview(r._id)}
                    className="rounded-lg border border-red-500/50 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10"
                  >
                    Delete {r.language} ({r.score})
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default ReviewHistoryPage;
