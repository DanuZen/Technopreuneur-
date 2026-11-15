"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { CVAnalysisResult } from "@/types";

interface CVDropzoneProps {
  onAnalysisComplete?: (result: CVAnalysisResult) => void;
  autoRedirect?: boolean;
}

export function CVDropzone({ onAnalysisComplete, autoRedirect = true }: CVDropzoneProps) {
  const router = useRouter();
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
      setStatus("extracting");
      const result = await api.uploadCV(selectedFile);

      setStatus("scoring");
      await new Promise((r) => setTimeout(r, 800));

      setStatus("completed");
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }

      if (autoRedirect) {
        await new Promise((r) => setTimeout(r, 600));
        router.push(`/user/dashboard/riwayat/${encodeURIComponent(result.cvId)}`);
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
      <div
        tabIndex={status === "idle" ? 0 : -1}
        role="button"
        aria-label="Area pengunggahan berkas CV digital"
        onKeyDown={(e) => {
          if (status === "idle" && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => status === "idle" && fileInputRef.current?.click()}
        className={`relative p-6 sm:p-9 border-2 border-dashed rounded-2xl text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f2c56] ${
          dragActive
            ? "border-[#ce2731] bg-slate-50"
            : "border-slate-300 bg-[#f8fafc] hover:border-[#0f2c56]"
        } ${status === "idle" ? "cursor-pointer group" : "cursor-default"}`}
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
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0f2c56] group-hover:bg-[#ce2731] text-white flex items-center justify-center transition-colors">
              <UploadCloud className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0f2c56] font-heading">
                Tarik berkas CV Anda ke sini atau{" "}
                <span className="underline decoration-2 underline-offset-4">
                  klik untuk memilih
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Mendukung format dokumen digital <strong className="text-[#0f2c56]">PDF</strong> atau{" "}
                <strong className="text-[#0f2c56]">DOCX</strong> (Maksimal 5 MB)
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-[11px] text-white bg-[#0f2c56] px-3.5 py-1.5 rounded-full font-semibold max-w-lg">
              <span className="w-2 h-2 rounded-full bg-[#ce2731] shrink-0" />
              <span>Pastikan berkas berbasis teks digital, bukan hasil foto/scan gambar dokumen.</span>
            </div>
          </div>
        )}

        {status !== "idle" && file && (
          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl text-left">
              <div className="w-10 h-10 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#0f2c56] truncate">{file.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              {status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-[#0f2c56] shrink-0" />
              ) : status === "error" ? (
                <AlertCircle className="w-5 h-5 text-[#ce2731] shrink-0" />
              ) : (
                <Loader2 className="w-5 h-5 text-[#ce2731] animate-spin shrink-0" />
              )}
            </div>

            {status !== "error" && (
              <div className="grid grid-cols-3 gap-2 text-[11px] font-bold">
                <div
                  className={`p-2 rounded-lg text-center ${
                    status === "uploading"
                      ? "bg-[#0f2c56] text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  1. Unggah Berkas
                </div>
                <div
                  className={`p-2 rounded-lg text-center ${
                    status === "extracting"
                      ? "bg-[#0f2c56] text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  2. Ekstraksi Teks
                </div>
                <div
                  className={`p-2 rounded-lg text-center ${
                    status === "scoring" || status === "completed"
                      ? "bg-[#ce2731] text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  3. Skor 5 Dimensi
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-3">
                <p className="text-xs text-white bg-[#ce2731] p-3 rounded-xl font-semibold">
                  {errorMessage || "Gagal memproses berkas CV."}
                </p>
                <button
                  type="button"
                  onClick={resetUpload}
                  className="text-xs font-bold text-[#0f2c56] hover:underline"
                >
                  Coba Unggah Ulang Berkas Lain
                </button>
              </div>
            )}

            {status === "completed" && (
              <div className="p-3 bg-[#0f2c56] rounded-xl text-white text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#ce2731]" aria-hidden="true" />
                  CV berhasil dianalisa secara objektif!
                </span>
                <button
                  type="button"
                  onClick={resetUpload}
                  className="text-[11px] text-white/80 underline hover:text-white"
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
