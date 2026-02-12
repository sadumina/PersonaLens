import { useState } from "react";
import { analyzeCV } from "../services/api";

export default function UploadPanel({ setData }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const result = await analyzeCV(file);
      setData(result);
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Upload Your CV (PDF)
      </h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
        className="text-white"
      />

      {loading && <p className="mt-3 text-blue-300">Analyzing...</p>}
    </div>
  );
}
