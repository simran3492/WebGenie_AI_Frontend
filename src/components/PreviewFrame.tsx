import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState } from 'react';

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState<string>("Installing dependencies...");

  const runCommand = async (cmd: string, args: string[]) => {
    const process = await webContainer.spawn(cmd, args);
    process.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );
    const exitCode = await process.exit;
    if (exitCode !== 0) {
      throw new Error(`${cmd} ${args.join(" ")} failed with code ${exitCode}`);
    }
  };

  const startPreview = async () => {
    try {
      setLoadingMessage("Installing dependencies...");
      await runCommand("npm", ["install"]);

      setLoadingMessage("Starting development server...");
      webContainer.on("server-ready", (port, previewUrl) => {
        console.log(`Server ready on ${previewUrl}:${port}`);
        setUrl(previewUrl);
      });

      await runCommand("npm", ["run", "dev"]);
    } catch (err) {
      console.error("Error starting preview:", err);
      setLoadingMessage("Failed to start preview. Check console for details.");
    }
  };

  useEffect(() => {
    startPreview();
  }, []);

  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url ? (
        <div className="text-center">
          <p className="mb-2">{loadingMessage}</p>
        </div>
      ) : (
        <iframe
          title="Preview"
          width="100%"
          height="100%"
          src={url}
          style={{ border: "none" }}
        />
      )}
    </div>
  );
}  

