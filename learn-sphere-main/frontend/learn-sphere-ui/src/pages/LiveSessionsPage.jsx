import React from "react";
import { Link, useLocation } from "react-router-dom";

const LiveSessionsPage = () => {
  const location = useLocation();
  const liveSessions = location.state?.liveSessions || [];

  if (!liveSessions.length) {
    return <div>No live sessions available.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">All Live Sessions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {liveSessions.map((session) => (
          <article
            key={session.id}
            className="rounded-xl border overflow-hidden group"
            style={{
              borderColor: "var(--border)",
              background: "var(--card)",
            }}
          >
            <div
              className="h-52 w-full bg-center bg-cover"
              style={{ backgroundImage: `url('${session.thumbnail}')` }}
              aria-label={session.title}
            />
            <div className="p-4">
              <h4 className="text-sm font-bold">{session.title}</h4>
              <p className="mt-1 text-sm opacity-80">By {session.instructor}</p>
              <p className="mt-1 text-sm opacity-70">
                {new Date(session.startTime).toLocaleString()} ·{" "}
                {session.durationMins} mins
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Link
                  to={`/session/${session.id}`}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-white bg-gradient-to-tr from-indigo-600 to-blue-500 shadow hover:shadow-md transition"
                >
                  {session.isLive ? "Join Now" : "Set Reminder"}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default LiveSessionsPage;
