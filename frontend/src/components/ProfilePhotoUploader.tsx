import React, { useRef, useState } from "react";

export type ProfilePhotoUploaderProps = {
  photoUrl: string | null;
  initials: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => Promise<void>;
  isUploading?: boolean;
  errorMessage?: string | null;
};

export default function ProfilePhotoUploader({
  photoUrl,
  initials,
  onUpload,
  onRemove,
  isUploading = false,
  errorMessage = null,
}: ProfilePhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file).finally(() => {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      });
    }
  };

  const handleRemove = async () => {
    if (!photoUrl) return;
    if (!window.confirm("Remove profile photo?")) {
      return;
    }
    await onRemove();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "relative",
          width: "80px",
          height: "80px",
          margin: "0 auto 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "2px solid #d1d5db",
          }}
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={initials}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#6b7280",
              }}
            >
              {initials}
            </div>
          )}
        </div>

        {photoUrl && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isUploading}
            title="Remove photo"
            style={{
              position: "absolute",
              bottom: "-6px",
              left: "-6px",
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              backgroundColor: "#dc2626",
              color: "white",
              border: "2px solid white",
              cursor: isUploading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              fontSize: "16px",
              fontWeight: "bold",
              opacity: isHovered ? (isUploading ? 0.6 : 1) : 0,
              transition: "opacity 0.2s ease, transform 0.2s ease",
              transform: isHovered ? "translateY(0)" : "translateY(2px)",
              zIndex: 10,
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            }}
          >
            X
          </button>
        )}
      </div>

      {errorMessage && (
        <div
          style={{
            marginBottom: "0.75rem",
            padding: "0.5rem",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "0.5rem",
            color: "#b91c1c",
            fontSize: "0.8rem",
          }}
        >
          {errorMessage}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        style={{
          backgroundColor: isUploading ? "#9ca3af" : "#D50000",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          border: "none",
          cursor: isUploading ? "not-allowed" : "pointer",
          fontSize: "0.875rem",
          fontWeight: 500,
          width: "100%",
        }}
      >
        {isUploading ? "Uploading..." : photoUrl ? "Change Photo" : "Upload Photo"}
      </button>

      <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.5rem" }}>
        JPEG, PNG, or WebP - Max 2MB
      </p>
    </div>
  );
}
