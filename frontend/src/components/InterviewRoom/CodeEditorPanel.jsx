import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useSelector } from 'react-redux';
import { X, Play, Eraser, WifiOff, Wifi } from 'lucide-react';
import { toast } from 'sonner';
import { useSocket } from '@/contexts/SocketContext';
import { Button } from '../ui/button';
import { runCode } from '@/api/interview/runCode';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const LANGUAGE_OPTIONS = [
  {
    value: '63',
    languageId: 63,
    label: 'JavaScript (Node.js)',
    monacoLanguage: 'javascript',
    starterCode: "console.log('Hello from JavaScript');",
  },
  {
    value: '54',
    languageId: 54,
    label: 'C++ (GCC)',
    monacoLanguage: 'cpp',
    starterCode: [
      '#include <iostream>',
      'using namespace std;',
      '',
      'int main() {',
      '    cout << "Hello from C++" << endl;',
      '    return 0;',
      '}',
    ].join('\n'),
  },
  {
    value: '71',
    languageId: 71,
    label: 'Python (3.x)',
    monacoLanguage: 'python',
    starterCode: "print('Hello from Python')",
  },
  {
    value: '62',
    languageId: 62,
    label: 'Java',
    monacoLanguage: 'java',
    starterCode: [
      'public class Main {',
      '    public static void main(String[] args) {',
      '        System.out.println("Hello from Java");',
      '    }',
      '}',
    ].join('\n'),
  },
  {
    value: '50',
    languageId: 50,
    label: 'C (GCC)',
    monacoLanguage: 'c',
    starterCode: [
      '#include <stdio.h>',
      '',
      'int main() {',
      '    printf("Hello from C\\n");',
      '    return 0;',
      '}',
    ].join('\n'),
  },
  {
    value: '51',
    languageId: 51,
    label: 'C# (Mono)',
    monacoLanguage: 'csharp',
    starterCode: [
      'using System;',
      '',
      'class Program',
      '{',
      '    static void Main()',
      '    {',
      '        Console.WriteLine("Hello from C#");',
      '    }',
      '}',
    ].join('\n'),
  },
  {
    value: '60',
    languageId: 60,
    label: 'Go',
    monacoLanguage: 'go',
    starterCode: [
      'package main',
      '',
      'import "fmt"',
      '',
      'func main() {',
      '    fmt.Println("Hello from Go")',
      '}',
    ].join('\n'),
  },
  {
    value: '68',
    languageId: 68,
    label: 'PHP',
    monacoLanguage: 'php',
    starterCode: [
      '<?php',
      'echo "Hello from PHP";',
    ].join('\n'),
  },
  {
    value: '72',
    languageId: 72,
    label: 'Ruby',
    monacoLanguage: 'ruby',
    starterCode: "puts 'Hello from Ruby'",
  },
  {
    value: '73',
    languageId: 73,
    label: 'Rust',
    monacoLanguage: 'rust',
    starterCode: [
      'fn main() {',
      '    println!("Hello from Rust");',
      '}',
    ].join('\n'),
  },
  {
    value: '74',
    languageId: 74,
    label: 'TypeScript',
    monacoLanguage: 'typescript',
    starterCode: [
      'const message: string = "Hello from TypeScript";',
      'console.log(message);',
    ].join('\n'),
  },
  {
    value: '78',
    languageId: 78,
    label: 'Kotlin',
    monacoLanguage: 'kotlin',
    starterCode: [
      'fun main() {',
      '    println("Hello from Kotlin")',
      '}',
    ].join('\n'),
  },
];

const LEGACY_LANGUAGE_MAP = {
  javascript: '63',
  cpp: '54',
  python: '71',
  java: '62',
};

const getLanguageConfig = (languageValue) => {
  return LANGUAGE_OPTIONS.find((item) => item.value === String(languageValue));
};

const resolveLanguageValue = (incomingLanguage) => {
  if (incomingLanguage === undefined || incomingLanguage === null) {
    return null;
  }

  const asString = String(incomingLanguage);
  if (getLanguageConfig(asString)) {
    return asString;
  }

  if (LEGACY_LANGUAGE_MAP[asString]) {
    return LEGACY_LANGUAGE_MAP[asString];
  }

  return null;
};

const CodeEditorPanel = ({ codeEditorVisibility, setCodeEditorVisibility }) => {
  const { interviewSessionData } = useSelector((state) => state.interviewSession);
  const { addEventListener, sendCodeChange, isConnected } = useSocket();
  const roomId = interviewSessionData?.roomId;

  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGE_OPTIONS[0].value);
  const [code, setCode] = useState(LANGUAGE_OPTIONS[0].starterCode);
  const [output, setOutput] = useState('Run your code to see output here...');
  const [isRunning, setIsRunning] = useState(false);
  const [isRemoteUserTyping, setIsRemoteUserTyping] = useState(false);
  const [remoteUserName, setRemoteUserName] = useState('');

  const isApplyingRemoteChangeRef = useRef(false);
  const emitDebounceRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const selectedLanguageConfig = getLanguageConfig(selectedLanguage) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    if (!addEventListener) {
      return;
    }

    const removeCodeTransmissionListener = addEventListener('code-transmission', (data) => {
      if (!data || typeof data.code !== 'string') {
        return;
      }

      const incomingLanguage = resolveLanguageValue(data.language) || selectedLanguage;

      isApplyingRemoteChangeRef.current = true;
      setSelectedLanguage(incomingLanguage);
      setCode(data.code);

      const userName = data.user?.email || 'User';
      setRemoteUserName(userName);
      setIsRemoteUserTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsRemoteUserTyping(false);
      }, 1500);
    });

    return () => {
      if (removeCodeTransmissionListener) {
        removeCodeTransmissionListener();
      }
      if (emitDebounceRef.current) {
        clearTimeout(emitDebounceRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [addEventListener, selectedLanguage]);

  const emitCodeUpdate = (nextLanguage, nextCode) => {
    if (!roomId || !sendCodeChange) {
      return;
    }

    if (typeof nextCode !== 'string') {
      return;
    }

    if (emitDebounceRef.current) {
      clearTimeout(emitDebounceRef.current);
    }

    emitDebounceRef.current = setTimeout(() => {
      sendCodeChange(roomId, nextLanguage, nextCode);
    }, 120);
  };

  const handleLanguageChange = (nextLanguage) => {
    const config = getLanguageConfig(nextLanguage);
    if (!config) {
      return;
    }

    setSelectedLanguage(nextLanguage);
    setCode(config.starterCode);
    setOutput('Language changed. Click Run to compile and execute.');
    emitCodeUpdate(nextLanguage, config.starterCode);
  };

  const handleEditorChange = (nextCode) => {
    if (isApplyingRemoteChangeRef.current) {
      isApplyingRemoteChangeRef.current = false;
      return;
    }

    if (typeof nextCode !== 'string') {
      return;
    }

    setCode(nextCode);
    emitCodeUpdate(selectedLanguage, nextCode);
  };

  const handleClear = () => {
    const starter = selectedLanguageConfig.starterCode;
    setCode(starter);
    setOutput('Editor cleared to starter template.');
    emitCodeUpdate(selectedLanguage, starter);
  };

  const handleRun = async () => {
    if (!code.trim()) {
      toast.error('Please write some code before running.');
      return;
    }

    setIsRunning(true);
    setOutput('Connecting to code execution service...');

    try {
      const response = await runCode(code, selectedLanguageConfig.languageId);
      const result = response?.data;

      const executionOutput =
        result?.stdout ||
        result?.compile_output ||
        result?.stderr ||
        result?.message ||
        'No output returned from Judge0.';

      setOutput(executionOutput);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      toast.error('Could not execute code.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div
      className={`fixed ${codeEditorVisibility ? 'right-0' : '-right-full'} top-0 z-30 h-full w-full sm:w-[90%] lg:w-[72%] bg-[#0f1116] shadow-2xl transition-all duration-300 ease-in-out flex flex-col border-l border-gray-800`}
    >
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-3 bg-[#12151d] border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <h2 className="text-white font-semibold text-base sm:text-lg">Live Code Editor</h2>
          {isRemoteUserTyping && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 rounded-full border border-blue-500/30">
              <div className="flex gap-0.5">
                <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-xs text-blue-400 font-medium whitespace-nowrap hidden sm:inline">{remoteUserName} is typing...</span>
              <span className="text-xs text-blue-400 font-medium whitespace-nowrap sm:hidden">Typing...</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCodeEditorVisibility(false)}
          className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
          aria-label="Close code editor"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-3 sm:px-4 py-3 border-b border-gray-800 bg-[#10141d]">
        <div className="w-full sm:w-56">
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="bg-[#1a1f2b] border-gray-700 text-white w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1f2b] border-gray-700 text-white">
              {LANGUAGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            type="button"
            onClick={handleClear}
            variant="outline"
            className="border-gray-700 bg-transparent text-gray-200 hover:bg-gray-800 hover:text-white w-full sm:w-auto"
          >
            <Eraser className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>

        <div className="sm:ml-auto flex items-center gap-2 text-xs text-gray-400">
          {isConnected ? <Wifi className="h-4 w-4 text-green-400" /> : <WifiOff className="h-4 w-4 text-red-400" />}
          <span>{isConnected ? 'Real-time sync on' : 'Socket disconnected'}</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-rows-[minmax(240px,1fr)_minmax(140px,38%)] lg:grid-rows-1 lg:grid-cols-[1fr_38%]">
        <div className="min-h-0 border-b lg:border-b-0 lg:border-r border-gray-800">
          <Editor
            theme="vs-dark"
            language={selectedLanguageConfig.monacoLanguage}
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              lineNumbersMinChars: 3,
            }}
            loading="Loading editor..."
            height="100%"
          />
        </div>

        <div className="min-h-0 bg-[#0b0d12] p-3 sm:p-4 overflow-auto">
          <h3 className="text-sm font-semibold text-gray-200 mb-2">Output</h3>
          <pre className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words text-gray-100 bg-[#111722] rounded-lg p-3 border border-gray-800 min-h-[110px]">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPanel;
