"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { CVAnalysisResult } from "@/types";

interface CVDropzoneProps {
  onAnalysisComplete?: (result: CVAnalysisResult) => void;
}

export function CVDropzone({ onAnalysisComplete }: CVDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "extracting" | "scoring" | "completed" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (selectedFile: File): boolean => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith(".pdf") && !selectedFile.name.endsWith(".docx")) {
      setErrorMessage("Format berkas harus berupa PDF atau DOCX.");
      return false;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMessage("Ukuran berkas melebihi batas maksimal 5 MB.");
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) {
      const selectedFile = files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        startAnalysis(selectedFile);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const startAnalysis = async (selectedFile: File) => {
    setStatus("uploading");
    setErrorMessage(null);

    try {
      // Step 1: Upload & Extract
      setStatus("extracting");
      const result = await api.uploadCV(selectedFile);

      // Step 2: Scoring
      setStatus("scoring");
      await new Promise((r) => setTimeout(r, 800)); // smooth visual transition

      setStatus("completed");
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err: unknown) {
      setStatus("error");
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Terjadi kesalahan saat memproses CV. Silakan coba kembali.");
      }
    }
  };

  const resetUpload = () => {
    setFile(null);
    setStatus("idle");
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => status === "idle" && fileInputRef.current?.click()}
        className={`relative p-8 sm:p-10 border-2 border-dashed rounded-2xl text-center transition-all ${
          dragActive
            ? "border-blue-600 bg-blue-50/50 scale-[1.01]"
            : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50/50"
        } ${status === "idle" ? "cursor-pointer" : "cursor-default"} shadow-sm`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={status !== "idle"}
        />

        {status === "idle" && (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                Tarik file CV Anda ke sini atau <span className="text-blue-600 underline">klik untuk memilih</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Mendukung format PDF atau DOCX (Maksimal 5 MB)
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Pastikan berkas berbasis teks digital, bukan hasil foto/scan gambar dokumen.</span>
            </div>
          </div>
        )}

        {status !== "idle" && file && (
          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{file.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              {status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : status === "error" ? (
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              ) : (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
              )}
            </div>

            {/* Stepper Status AI */}
            {status !== "error" && (
              <div className="grid grid-cols-3 gap-2 text-[11px] font-medium text-slate-600">
                <div className={`p-2 rounded-lg text-center ${status === "uploading" ? "bg-blue-50 text-blue-700 font-semibold" : "bg-slate-100"}`}>
                  1. Unggah Berkas
                </div>
                <div className={`p-2 rounded-lg text-center ${status === "extracting" ? "bg-blue-50 text-blue-700 font-semibold" : "bg-slate-100"}`}>
                  2. Ekstraksi AI
                </div>
                <div className={`p-2 rounded-lg text-center ${status === "scoring" || status === "completed" ? "bg-emerald-50 text-emerald-700 font-semibold" : "bg-slate-100"}`}>
                  3. Skor 5 Dimensi
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-3">
                <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  {errorMessage || "Gagal memproses berkas CV."}
                </p>
                <button
                  type="button"
                  onClick={resetUpload}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Coba Unggah Ulang Berkas Lain
                </button>
              </div>
            )}

            {status === "completed" && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  CV berhasil dianalisa secara objektif!
                </span>
                <button
                  type="button"
                  onClick={resetUpload}
                  className="text-[11px] text-slate-600 underline hover:text-slate-900"
                >
                  Ganti File
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
