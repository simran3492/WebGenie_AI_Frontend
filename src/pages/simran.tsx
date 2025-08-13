import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { BlobPreviewFrame } from '../components/blobPreview';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { FileNode } from '@webcontainer/api';
import { Loader } from '../components/Loader';

const MOCK_FILE_CONTENT = `// This is a sample file content
import React from 'react';

function Component() {
  return <div>Hello World</div>;
}

export default Component;`;

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const [steps, setSteps] = useState<Step[]>([]);

  const [files, setFiles] = useState<FileItem[]>([]);

  // New state for deployment
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);


  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        let finalAnswerRef = currentFileStructure;

        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);

          if (!parsedPath.length) {
            // final file
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }

            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }

      }))
    }
    console.log(files);
  }, [steps, files]);

  const isPlainHTML = files.length > 0 &&
  !files.some(f => f.name === 'package.json') &&
  !files.some(f => f.content?.includes('import ') || f.content?.includes('require('));


  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: FileItem, isRootFolder: boolean) => {
        if (file.type === 'folder') {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children ?
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              )
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }

        return mountStructure[file.name];
      };

      // Process each top-level file/folder
      files.forEach(file => processFile(file, true));

      return mountStructure;
    };

    const mountStructure = createMountStructure(files);

    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim()
    });
    setTemplateSet(true);

    const {prompts, uiPrompts} = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        content
      }))
    })

    setLoading(false);

    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as "pending"
    }))]);

    setLlmMessages([...prompts, prompt].map(content => ({
      role: "user",
      content
    })));

    setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data.response}])
  }

  useEffect(() => {
    init();
  }, [])

    const handleDeploy = async () => {
        setIsDeploying(true);
        setDeploymentError(null);
        setDeploymentUrl(null);

        try {
            const response = await axios.post(`${BACKEND_URL}/deploy`, {
                files: files,
            });
            setDeploymentUrl(response.data.url);
        } catch (error) {
            console.error('Deployment failed:', error);
            setDeploymentError('Deployment failed. Please try again.');
        } finally {
            setIsDeploying(false);
        }
    };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      {/* Enhanced Header with Light Theme */}
      <header className="relative bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-6 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">
                  WebGenie AI
                </h1>
                <p className="text-sm text-gray-600 mt-1">Building your vision with AI</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
                {/* DEPLOY BUTTON LOGIC */}
                {deploymentUrl ? (
                    <a
                        href={deploymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all"
                    >
                        View Deployed Site
                    </a>
                ) : (
                    <button
                        onClick={handleDeploy}
                        disabled={isDeploying || files.length === 0}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 transition-all flex items-center"
                    >
                        {isDeploying ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deploying...
                            </>
                        ) : (
                            'Deploy'
                        )}
                    </button>
                )}
                {deploymentError && <p className="text-sm text-red-500">{deploymentError}</p>}
                {/* END DEPLOY BUTTON LOGIC */}
              <div className="px-4 py-2 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-600 font-medium">Status</span>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                  <span className="text-sm text-gray-800 font-medium">
                    {loading ? 'Processing...' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 backdrop-blur-sm rounded-xl border border-blue-200">
            <p className="text-sm text-gray-700 font-semibold">Current Prompt:</p>
            <p className="text-gray-800 mt-1 text-sm leading-relaxed">{prompt}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          {/* Steps Panel - Light Theme */}
          <div className="lg:col-span-1 space-y-6 overflow-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              {/* Steps Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Build Steps
                </h2>
                <p className="text-xs text-gray-600 mt-1">Track your project progress</p>
              </div>

              {/* Steps List Container */}
              <div className="max-h-[50vh] lg:max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="p-4">
                  <StepsList
                    steps={steps}
                    currentStep={currentStep}
                    onStepClick={setCurrentStep}
                  />
                </div>
              </div>

              {/* Chat Interface */}
              <div className="border-t border-gray-200 bg-gray-50/50">
                <div className="p-4">
                  {(loading || !templateSet) ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <Loader />
                        <p className="text-sm text-gray-600 mt-3 font-medium">
                          {!templateSet ? 'Initializing...' : 'Processing your request...'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <textarea
                          value={userPrompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Ask for changes or improvements..."
                          className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          rows={3}
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-500 font-medium">
                          {userPrompt.length}/500
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          const newMessage = {
                            role: "user" as "user",
                            content: userPrompt
                          };

                          setLoading(true);
                          const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                            messages: [...llmMessages, newMessage]
                          });
                          setLoading(false);

                          setLlmMessages(x => [...x, newMessage]);
                          setLlmMessages(x => [...x, {
                            role: "assistant",
                            content: stepsResponse.data.response
                          }]);

                          setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                            ...x,
                            status: "pending" as "pending"
                          }))]);

                          setPrompt("");
                        }}
                        disabled={loading || !userPrompt.trim()}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Send Request
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* File Explorer - Light Theme */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl h-full overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                  Project Files
                </h2>
                <p className="text-xs text-gray-600 mt-1">Browse and select files</p>
              </div>
              <div className="h-[calc(100%-5rem)] overflow-y-auto custom-scrollbar p-4">
                <FileExplorer
                  files={files}
                  onFileSelect={setSelectedFile}
                />
              </div>
            </div>
          </div>

          {/* Code/Preview Panel - Light Theme */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl overflow-hidden h-[calc(100vh-8rem)]">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50">
              <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="h-[calc(100%-5rem)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100/30 to-transparent pointer-events-none z-10" />
              <div className="h-full relative z-20 bg-white">
                {activeTab === 'code' ? (
                  <CodeEditor file={selectedFile} />
                ) : isPlainHTML ? (
                  <BlobPreviewFrame files={files} />
                ) : (
                  <PreviewFrame webContainer={webcontainer} files={files} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Light Theme Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(229, 231, 235, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.6);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.8);
        }
      `}</style>
    </div>
  );
}