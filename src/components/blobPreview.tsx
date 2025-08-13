import React, { useState, useEffect } from "react";
import { FileItem } from "../types";

export function BlobPreviewFrame({ files }: { files: FileItem[] }) {
  const [src, setSrc] = useState("");

  // Helper: Flatten nested file structure
  const flattenFiles = (fileList: FileItem[]): FileItem[] => {
    let result: FileItem[] = [];
    for (const file of fileList) {
      if (file.type === "file") {
        result.push(file);
      } else if (file.type === "folder" && file.children) {
        result = result.concat(flattenFiles(file.children));
      }
    }
    return result;
  };

  useEffect(() => {
    const flatFiles = flattenFiles(files);

    const htmlFile = flatFiles.find(f => f.name.endsWith(".html"));
    const cssFile = flatFiles.find(f => f.name.endsWith(".css"));
    const jsFile = flatFiles.find(f => f.name.endsWith(".js"));

    if (!htmlFile) {
      console.warn("No HTML file found in generated files");
      return;
    }

    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssFile?.content || ""}</style>
        </head>
        <body>
          ${htmlFile?.content || ""}
          <script>${jsFile?.content || ""}<\/script>
        </body>
      </html>
    `;

    const blob = new Blob([fullHTML], { type: "text/html" });
    setSrc(URL.createObjectURL(blob));
  }, [files]);

  return src ? (
    <iframe
      src={src}
      title="Preview"
      style={{ width: "100%", height: "100%", border: "1px solid #ccc" }}
    ></iframe>
  ) : (
    <div style={{ color: "white", padding: "20px" }}>
      No preview available (no HTML file found)
    </div>
  );
}
