import React, { useState, useRef } from "react";
import {
  Upload,
  Image,
  FileText,
  Loader,
  AlertCircle,
  CheckCircle,
  Plus,
  Sparkles,
} from "lucide-react";

const AIAnalyzer = ({ onTasksGenerated }) => {
  const [activeTab, setActiveTab] = useState("image");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [generatingTasks, setGeneratingTasks] = useState(false);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const API_BASE = "http://localhost:8081/api";

  const analyzeImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE}/analyze-image`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Lỗi khi phân tích ảnh");
    }

    return response.json();
  };

  const analyzeText = async (text) => {
    const response = await fetch(`${API_BASE}/analyze-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Lỗi khi phân tích text");
    }

    return response.json();
  };

  const analyzeFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/analyze-file`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Lỗi khi phân tích file");
    }

    return response.json();
  };

  const generateTasksFromAnalysis = async (analysis) => {
    try {
      const response = await fetch(`${API_BASE}/generate-tasks-from-analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ analysis }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Lỗi khi tạo tasks");
      }

      return response.json();
    } catch (error) {
      console.error("Error generating tasks:", error);
      throw error;
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setGeneratedTasks([]);

    try {
      const response = await analyzeImage(file);
      setResult({
        type: "image",
        data: response,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setGeneratedTasks([]);

    try {
      const response = await analyzeFile(file);
      setResult({
        type: "file",
        data: response,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTextAnalysis = async () => {
    if (!textInput.trim()) {
      setError("Vui lòng nhập nội dung để phân tích");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setGeneratedTasks([]);

    try {
      const response = await analyzeText(textInput);
      setResult({
        type: "text",
        data: response,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTasks = async () => {
    if (!result?.data?.analysis) return;

    setGeneratingTasks(true);
    try {
      const tasksResponse = await generateTasksFromAnalysis(
        result.data.analysis
      );
      if (tasksResponse.success) {
        setGeneratedTasks(tasksResponse.tasks);
        if (onTasksGenerated) {
          onTasksGenerated(tasksResponse.tasks);
        }
      } else {
        setError("Không thể tạo tasks từ phân tích");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingTasks(false);
    }
  };

  const formatAnalysis = (analysis) => {
    const sections = analysis.split(/\*\*(.*?)\*\*/g);
    const formattedSections = [];

    for (let i = 0; i < sections.length; i += 2) {
      const content = sections[i];
      const heading = sections[i + 1];

      if (content && content.trim()) {
        formattedSections.push({
          type: "content",
          text: content.trim(),
        });
      }

      if (heading) {
        formattedSections.push({
          type: "heading",
          text: heading,
        });
      }
    }

    return formattedSections;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="text-yellow-300" size={28} />
          <div>
            <h2 className="text-xl font-bold text-white">
              AI Content Analyzer
            </h2>
            <p className="text-purple-100 text-sm">
              Phân tích nội dung và tạo tasks tự động
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab("image")}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors text-sm ${
              activeTab === "image"
                ? "border-b-2 border-purple-500 text-purple-600 bg-purple-50"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Image size={18} />
            Ảnh
          </button>
          <button
            onClick={() => setActiveTab("file")}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors text-sm ${
              activeTab === "file"
                ? "border-b-2 border-purple-500 text-purple-600 bg-purple-50"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Upload size={18} />
            File
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors text-sm ${
              activeTab === "text"
                ? "border-b-2 border-purple-500 text-purple-600 bg-purple-50"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FileText size={18} />
            Text
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "image" && (
          <div className="space-y-3">
            <div
              onClick={() => imageInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors text-center"
            >
              <Image size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 text-sm mb-1">Click để chọn ảnh</p>
              <p className="text-xs text-gray-400">PNG, JPG, JPEG, GIF, WebP</p>
            </div>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}

        {activeTab === "file" && (
          <div className="space-y-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors text-center"
            >
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 text-sm mb-1">Click để chọn file</p>
              <p className="text-xs text-gray-400">
                TXT, MD, CSV, JSON, JS, HTML, CSS
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.csv,.json,.js,.html,.css"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {activeTab === "text" && (
          <div className="space-y-3">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Nhập nội dung cần phân tích..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-sm"
            />
            <button
              onClick={handleTextAnalysis}
              disabled={loading || !textInput.trim()}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin" size={16} />
                  Đang phân tích...
                </div>
              ) : (
                "Phân tích nội dung"
              )}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && activeTab !== "text" && (
          <div className="text-center py-6">
            <Loader
              className="animate-spin mx-auto text-purple-600 mb-3"
              size={32}
            />
            <p className="text-gray-600 text-sm">Đang phân tích nội dung...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle
              className="text-red-500 flex-shrink-0 mt-0.5"
              size={16}
            />
            <div>
              <h4 className="font-medium text-red-800 text-sm">
                Có lỗi xảy ra
              </h4>
              <p className="text-red-600 text-xs mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                <h3 className="font-semibold text-green-800 text-sm">
                  Kết quả phân tích
                </h3>
              </div>
              <button
                onClick={handleGenerateTasks}
                disabled={generatingTasks}
                className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {generatingTasks ? (
                  <>
                    <Loader className="animate-spin" size={12} />
                    Tạo tasks...
                  </>
                ) : (
                  <>
                    <Plus size={12} />
                    Tạo Tasks
                  </>
                )}
              </button>
            </div>

            {result.data.filename && (
              <div className="mb-3 p-2 bg-white rounded border text-xs">
                <p className="text-gray-600">
                  <strong>File:</strong> {result.data.filename}
                </p>
                {result.data.fileSize && (
                  <p className="text-gray-600">
                    <strong>Kích thước:</strong>{" "}
                    {(result.data.fileSize / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
            )}

            <div className="prose max-w-none text-sm">
              {formatAnalysis(result.data.analysis).map((section, index) => (
                <div key={index}>
                  {section.type === "heading" ? (
                    <h4 className="font-semibold text-gray-800 mt-3 mb-1 text-sm">
                      {section.text}
                    </h4>
                  ) : (
                    <p className="text-gray-700 mb-2 leading-relaxed text-xs">
                      {section.text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Tasks */}
        {generatedTasks.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Plus className="text-blue-600" size={20} />
              <h3 className="font-semibold text-blue-800 text-sm">
                Tasks được tạo ({generatedTasks.length})
              </h3>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {generatedTasks.map((task, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded border text-xs"
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        task.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                      {task.category}
                    </span>
                    {task.estimatedDuration && (
                      <span>{task.estimatedDuration} phút</span>
                    )}
                    {task.dueDate && <span>Đến hạn: {task.dueDate}</span>}
                  </div>
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {task.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalyzer;
