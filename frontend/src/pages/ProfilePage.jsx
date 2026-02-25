import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/api";
import { formatDate } from "../utils/helpers";

const ProfilePage = () => {
  const { user, refreshProfile, setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  const onSave = async () => {
    setStatus("");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (file) formData.append("profileImage", file);

      const { data } = await api.put("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setUser(data.user);
      await refreshProfile();
      setStatus("Profile updated");
      setFile(null);
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <PageTransition>
      <div className="grid gap-4 xl:grid-cols-3">
        <section className="glass-card rounded-2xl p-5">
          <img
            src={
              user?.profileImage
                ? `${import.meta.env.VITE_API_URL?.replace("/api", "")}${user.profileImage}`
                : "https://api.dicebear.com/9.x/initials/svg?seed=Profile"
            }
            alt="profile"
            className="mb-4 h-20 w-20 rounded-full border border-slate-700 object-cover"
          />
          <h2 className="text-lg font-semibold">{user?.name}</h2>
          <p className="text-sm text-slate-300">{user?.email}</p>
          <div className="mt-4 space-y-1 text-sm text-slate-300">
            <p>Total Reviews: {user?.totalReviews || 0}</p>
            <p>Average Score: {user?.averageScore || 0}</p>
            <p>Join Date: {user?.createdAt ? formatDate(user.createdAt) : "N/A"}</p>
          </div>
        </section>

        <section className="glass-card rounded-2xl p-5 xl:col-span-2">
          <h1 className="mb-4 text-xl font-bold">Edit Profile</h1>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2"
              />
            </label>

            <label className="text-sm">
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2"
              />
            </label>
          </div>

          <label className="mt-3 block text-sm">
            Upload Profile Picture
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2" />
          </label>

          <button onClick={onSave} className="mt-4 rounded-xl bg-brand-primary px-4 py-2 text-white">
            Save Changes
          </button>

          {status && <p className="mt-3 text-sm text-slate-200">{status}</p>}
        </section>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;

