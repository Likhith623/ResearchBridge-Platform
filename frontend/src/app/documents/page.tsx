"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Sparkles,
  Download,
  BookOpen,
  CheckCircle,
  Clock,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import { api } from "@/lib/api";
import { DocumentRecord, PaperSummary } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [summary, setSummary] = useState<PaperSummary | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadScope, setUploadScope] = useState("public");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const loadDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      const docs = await api.getDocuments();
      setDocuments(docs || []);
      if (docs && docs.length > 0 && !selectedDoc) {
        handleSelectDocument(docs[0]);
      }
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleSelectDocument = async (doc: DocumentRecord) => {
    setSelectedDoc(doc);
    setSummary(null);
    try {
      const existingSummary = await api.getDocumentSummary(doc.id);
      setSummary(existingSummary);
    } catch {
      // Summary not generated yet
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedDoc) return;
    setIsSummarizing(true);
    try {
      const sum = await api.summarizeDocument(selectedDoc.id);
      setSummary(sum);
    } catch (err: any) {
      alert(err.message || "Failed to generate AI paper summary");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !uploadTitle.trim()) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", uploadTitle);
      formData.append("access_scope", uploadScope);

      const created = await api.uploadDocument(formData);
      setIsUploadModalOpen(false);
      setUploadTitle("");
      setFile(null);
      await loadDocuments();
      handleSelectDocument(created);
    } catch (err: any) {
      alert(err.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Academic Research Paper Library &amp; AI Summaries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload scientific manuscripts and preprints to generate structured, plain-language summaries powered by Gemini.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsUploadModalOpen(true)}
          className="text-xs gap-1.5 shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload PDF Paper</span>
        </Button>
      </div>

      {/* Main 2-Panel View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Document List */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Paper Repository ({documents.length})</CardTitle>
              <CardDescription className="text-xs">
                Stored in private university Supabase storage
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100 p-0">
              {isLoadingDocs ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Loading repository...
                </div>
              ) : documents.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No papers uploaded yet. Upload a PDF paper above!
                </div>
              ) : (
                documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => handleSelectDocument(doc)}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                      selectedDoc?.id === doc.id
                        ? "bg-blue-50/70 border-l-2 border-l-blue-600"
                        : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-slate-900 truncate">
                        {doc.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {doc.file_name} • {(doc.byte_size / 1024).toFixed(0)} KB
                      </p>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 mt-1 capitalize">
                        {doc.access_scope}
                      </Badge>
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Active Document Summary Viewer */}
        <div className="lg:col-span-2">
          {selectedDoc ? (
            <Card className="p-6 space-y-6">
              {/* Document Overview Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      {selectedDoc.title}
                    </h2>
                    <Badge variant="teal" className="text-xs">
                      {selectedDoc.mime_type}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    Uploaded {formatDate(selectedDoc.created_at)} • File: {selectedDoc.file_name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!summary && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleGenerateSummary}
                      isLoading={isSummarizing}
                      className="text-xs gap-1.5 shadow-sm shadow-blue-500/20"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                      <span>Generate AI Summary</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Summary Presentation */}
              {summary ? (
                <div className="space-y-6 text-xs leading-relaxed text-slate-700">
                  {/* One-Sentence Takeaway */}
                  <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 text-blue-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-blue-700">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Key Research Takeaway</span>
                    </div>
                    <p className="text-xs font-semibold leading-relaxed">
                      {summary.one_sentence_takeaway}
                    </p>
                  </div>

                  {/* Executive Summary */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Executive Summary
                    </h4>
                    <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                      {summary.executive_summary}
                    </p>
                  </div>

                  {/* Problem & Methodology Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                      <h4 className="font-bold text-slate-900">Research Problem</h4>
                      <p className="text-slate-600">{summary.problem_statement}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                      <h4 className="font-bold text-slate-900">Methodology Breakdown</h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-600">
                        {summary.methodology_breakdown?.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Key Findings */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900">Key Scientific Findings</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {summary.key_findings?.map((f, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg border border-slate-100 bg-white flex items-start gap-2"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Professor Discussion Questions */}
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2 text-amber-900">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>Prompts to Discuss with Professor</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-amber-800">
                      {summary.discussion_prompts?.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 space-y-3">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">
                    Click <strong>"Generate AI Summary"</strong> above to extract structured methodology, takeaways, and discussion points.
                  </p>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-16 text-center text-xs text-slate-400">
              Select a research paper from the repository to view its AI summary.
            </Card>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Academic Manuscript / Preprint (PDF)"
        description="PDF documents will be stored securely and analyzed by the Gemini research assistant."
        maxWidth="md"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Paper Title
            </label>
            <input
              type="text"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g. Attention Is All You Need"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Access Scope
            </label>
            <select
              value={uploadScope}
              onChange={(e) => setUploadScope(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
            >
              <option value="public">Public (All University Researchers)</option>
              <option value="institution">Institution Only</option>
              <option value="private">Private (Only You)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Select PDF File
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isUploading}>
              Upload Document
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
