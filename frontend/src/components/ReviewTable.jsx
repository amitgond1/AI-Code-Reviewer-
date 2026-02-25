import { Link } from "react-router-dom";
import { formatDate, languageLabel } from "../utils/helpers";

const ReviewTable = ({ reviews = [] }) => {
  if (!reviews.length) {
    return <p className="text-sm text-slate-300">No reviews yet.</p>;
  }

  return (
    <div className="overflow-auto rounded-2xl border border-slate-700/70">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-800/70 text-slate-300">
          <tr>
            <th className="px-3 py-2 text-left">Language</th>
            <th className="px-3 py-2 text-left">Score</th>
            <th className="px-3 py-2 text-left">Lines</th>
            <th className="px-3 py-2 text-left">Date</th>
            <th className="px-3 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id} className="border-t border-slate-700/60">
              <td className="px-3 py-2">{languageLabel(review.language)}</td>
              <td className="px-3 py-2">{review.score}/100</td>
              <td className="px-3 py-2">{review.linesOfCode}</td>
              <td className="px-3 py-2">{formatDate(review.createdAt)}</td>
              <td className="px-3 py-2">
                <Link to={`/app/history/${review._id}`} className="text-brand-secondary hover:underline">
                  View Review
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewTable;

