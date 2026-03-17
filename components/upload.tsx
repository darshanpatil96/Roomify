import { useState, useRef } from "react";
import {
  Upload as UploadIcon,
  CheckCircle2,
  ImageIcon,
} from "lucide-react";
import { PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS } from "@/lib/constants";

interface UploadProps {
  onComplete?: (base64: string) => void;
}

const Upload = ({ onComplete }: UploadProps) => {

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Note: This should ideally come from AuthContext, but following requested logic structure
  const isSignedIn = true;

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isSignedIn) setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isSignedIn && e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSignedIn && e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    if (!isSignedIn) return;

    setFile(selectedFile);
    setIsUploading(true);
    setProgress(0);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              if (onComplete) onComplete(base64String);
            }, REDIRECT_DELAY_MS);
            return 100;
          }
          return prev + PROGRESS_STEP;
        });
      }, PROGRESS_INTERVAL_MS);
    };
    reader.readAsDataURL(selectedFile);
  };

  const triggerFileInput = () => {
    if (isSignedIn) fileInputRef.current?.click();
  };

  return (
    <div className="flex justify-center mt-2">
      <div className="upload">
        {!isUploading ? (
        <div
          className={`dropzone ${isDragging ? "is-dragging" : ""} ${!isSignedIn ? "opacity-50 cursor-not-allowed" : ""}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".png,.jpg,.jpeg"
            disabled={!isSignedIn}
            onChange={handleFileChange}
          />

          <div className="drop-content">
            <div className="drop-icon">
              <UploadIcon size={20} />
            </div>

            <p>
              {isSignedIn
                ? "Click to upload or drag & drop"
                : "Sign in to upload"}
            </p>
            <p className="help">Maximum file size 50 MB.</p>
          </div>
        </div>
      ) : (

          <div className="upload-status">
            <div className="status-content">
              <div className="status-icon">
                {progress === 100 ? (
                  <CheckCircle2 className="check" />
                ) : (
                  <ImageIcon className="image" />
                )}
              </div>

              <h3>{file?.name}</h3>

              <div className="progress">
                <div
                  className="bar"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <p className="status-text">
                {progress < 100
                  ? "Analyzing floor plan..."
                  : "Redirecting..."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;