"use client";

import { useState, useEffect } from "react";
import { Loader2, StopCircle, RefreshCw, LogOut } from "lucide-react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getBaseUrl = () => {
      // For Next.js, fallback to a sensible default or hardcode for render
      // Let's use window.location.origin but swap the port to 3001 if local
      if (typeof window === "undefined") return "";
      if (window.location.hostname === "localhost") {
          return "http://localhost:3001";
      }
      return "https://dps-scheduler-api.onrender.com";
  };

  const fetchJobs = async (pass: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${getBaseUrl()}/api/admin/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass }),
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        setAuthenticated(true);
      } else if (res.status === 401) {
        setError("Invalid password");
        setAuthenticated(false);
      } else {
        setError("Failed to fetch jobs");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(password);
  };

  const handleStopJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to terminate this job?")) return;
    
    try {
      const res = await fetch(`${getBaseUrl()}/api/admin/jobs/${jobId}/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        // refresh jobs
        fetchJobs(password);
      } else {
        alert("Failed to stop job");
      }
    } catch (err) {
      alert("Error stopping job");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl space-y-6">
          <h1 className="text-2xl font-bold text-center dark:text-white">Admin Access</h1>
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">{error}</div>}
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-gray-300">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter admin password"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <h1 className="text-3xl font-bold dark:text-white">Active Jobs Dashboard</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchJobs(password)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={() => { setAuthenticated(false); setPassword(""); }}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Job ID</th>
                  <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Name</th>
                  <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Email</th>
                  <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Location (Zip)</th>
                  <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400">Service Type</th>
                  <th className="p-4 font-medium text-sm text-gray-500 dark:text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No active jobs currently running on the server.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.jobId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="p-4 text-sm font-mono text-gray-600 dark:text-gray-300">
                        {job.jobId.split("-")[0]}...
                      </td>
                      <td className="p-4 text-sm font-medium dark:text-gray-200">
                        {job.firstName} {job.lastName}
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]" title={job.email}>
                        {job.email || "N/A"}
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                        {job.zipCode || "N/A"}
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                        {job.typeId || "N/A"}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleStopJob(job.jobId)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-md text-sm font-medium transition-colors cursor-pointer"
                        >
                          <StopCircle className="w-4 h-4" />
                          Terminate
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
