import { useRouteError } from "react-router-dom";

function RouteErrorFallback() {
  const error = useRouteError();
  const message = error?.message || "Unexpected error";

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10 font-sans flex items-center justify-center">
      <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/10">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">
          Page crashed
        </h1>
        <p className="mb-4 leading-relaxed text-slate-700">
          This page hit an error. Please go back home and try again.
        </p>
        <p className="mb-5 rounded-lg border border-slate-200 bg-slate-100 p-3 text-sm text-slate-800">
          Error: {message}
        </p>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-white transition hover:bg-slate-700"
        >
          Go to home
        </button>
      </div>
    </div>
  );
}

export default RouteErrorFallback;
