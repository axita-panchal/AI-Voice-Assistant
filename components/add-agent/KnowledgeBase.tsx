"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  useUploadKnowledgeBase,
  useDeleteKnowledgeBaseFile,
} from "@/hooks/agent/useAgentMutations";
import { toast } from "@/utils/toast";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_EXTENSIONS = [".pdf", ".txt", ".doc", ".docx"];

interface UploadedFile {
  name: string;
  size: number;
  uploadedAt?: string;
}

export default function KnowledgeBase({ agentId }: { agentId?: string }) {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadKnowledgeBase();
  const deleteMutation = useDeleteKnowledgeBaseFile();

  // Validation functions
  const validateFiles = (
    files: File[],
  ): { valid: File[]; errors: string[] } => {
    const errors: string[] = [];
    const validFiles: File[] = [];

    files.forEach((file) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(
          `${file.name} exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        );
        return;
      }

      // Check file type
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (
        !ALLOWED_FILE_TYPES.includes(file.type) &&
        !ALLOWED_EXTENSIONS.includes(fileExtension)
      ) {
        errors.push(
          `${file.name} has unsupported format. Allowed: PDF, TXT, DOC, DOCX`,
        );
        return;
      }

      // Check for duplicate files
      if (selectedFiles.some((f) => f.name === file.name)) {
        errors.push(`${file.name} is already selected`);
        return;
      }

      validFiles.push(file);
    });

    return { valid: validFiles, errors };
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const { valid, errors } = validateFiles(Array.from(files));

    if (errors.length > 0) {
      setValidationErrors(errors);
      errors.forEach((error) => toast?.error(error));
      return;
    }

    setSelectedFiles((prev) => [...prev, ...valid]);
    setValidationErrors([]);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!agentId) {
      setValidationErrors(["Agent ID is required"]);
      toast?.error("Save the agent first");
      return;
    }

    if (selectedFiles.length === 0) {
      setValidationErrors(["Please select at least one file"]);
      toast?.error("Please select at least one file");
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        agentId,
        files: selectedFiles,
      });

      // Add uploaded files to the list
      const newFiles = selectedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toLocaleString(),
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      setSelectedFiles([]);
      setValidationErrors([]);

      toast?.success("Files uploaded successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again.";
      setValidationErrors([errorMessage]);
      toast?.error(errorMessage);
    }
  };

  const handleDeleteFile = async (fileName: string) => {
    if (!agentId) {
      toast?.error("Agent ID is required");
      return;
    }

    try {
      await deleteMutation.mutateAsync({
        agentId,
        fileName,
      });

      setUploadedFiles((prev) => prev.filter((f) => f.name !== fileName));
      toast?.success(`${fileName} deleted successfully`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Delete failed. Please try again.";
      toast?.error(errorMessage);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {!agentId ? (
        <div className="flex items-center justify-center py-12 bg-yellow-50 rounded-xl border border-yellow-200">
          <p className="text-sm text-yellow-800">
            Save the agent first to manage knowledge base
          </p>
        </div>
      ) : (
        <>
          {/* TOP CARD */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 bg-[#F5F8FF] rounded-xl">
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-700">
                Manage Knowledge
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Add knowledge that your assistant can use during phone calls.
              </p>
            </div>

            <button
              onClick={() => setIsManageOpen(true)}
              className="w-full sm:w-auto px-4 py-2 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              Manage
            </button>
          </div>

          {/* EXPANDED CARD */}
          {isManageOpen && (
            <div className="bg-gray-100 rounded-xl p-4 sm:p-6 space-y-4 relative">
              {/* Pointer */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-100 rotate-45 hidden sm:block" />

              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <button
                    onClick={() => setIsManageOpen(false)}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    ✕
                  </button>
                  Manage Knowledge
                </div>

                <div className="flex flex-wrap gap-2">
                  <ActionButton
                    label="Add File"
                    icon="/assets/svgs/folder.svg"
                    onClick={() => fileInputRef.current?.click()}
                  />
                  {/* <ActionButton
                    label="Add URL"
                    icon="/assets/svgs/link.svg"
                    onClick={() => {}}
                  />
                  <ActionButton
                    label="Add Text"
                    icon="/assets/svgs/text_line.svg"
                    onClick={() => {}}
                  /> */}
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ALLOWED_EXTENSIONS.join(",")}
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />

              {/* VALIDATION ERRORS */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <ul className="text-xs text-red-700 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SELECTED FILES */}
              {selectedFiles.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-blue-900 mb-3">
                    Selected Files ({selectedFiles.length})
                  </p>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white p-2 rounded border border-blue-100"
                      >
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-700">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending}
                    className="w-full mt-3 px-4 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 cursor-pointer font-medium"
                  >
                    {uploadMutation.isPending ? "Uploading..." : "Upload Files"}
                  </button>
                </div>
              )}

              {/* SEARCH */}
              {/* <input
                type="text"
                placeholder="Search uploaded files"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              /> */}

              {/* UPLOADED FILES */}
              {uploadedFiles.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                  <p className="text-xs font-medium text-gray-700 mb-3">
                    Uploaded Files ({uploadedFiles.length})
                  </p>
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border border-gray-100 rounded hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-700">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                        {file.uploadedAt && (
                          <p className="text-xs text-gray-400">
                            {file.uploadedAt}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteFile(file.name)}
                        disabled={deleteMutation.isPending}
                        className="text-red-500 hover:text-red-700 text-sm font-bold disabled:opacity-50 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploadedFiles.length === 0 && selectedFiles.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-xs text-gray-500">No files uploaded yet</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---------------- Small Button ---------------- */

function ActionButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full sm:w-auto px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex items-center justify-center sm:justify-start gap-1">
        <Image src={icon} alt={label} height={16} width={16} />
        {label}
      </div>
    </button>
  );
}
