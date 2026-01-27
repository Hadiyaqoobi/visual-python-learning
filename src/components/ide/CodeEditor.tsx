"use client";

import { useRef, useCallback } from "react";
import Editor, { OnMount, OnChange } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Spinner } from "@/components/ui";

export interface CodeEditorProps {
  /** Initial code value (uncontrolled) */
  defaultValue?: string;
  /** Controlled code value */
  value?: string;
  /** Called when code changes */
  onChange?: (value: string) => void;
  /** Programming language for syntax highlighting */
  language?: string;
  /** Editor color theme */
  theme?: "vs-dark" | "light";
  /** Editor height (CSS value) */
  height?: string;
  /** Make editor read-only */
  readOnly?: boolean;
  /** Show line numbers */
  lineNumbers?: "on" | "off" | "relative";
  /** Show minimap */
  minimap?: boolean;
  /** Font size in pixels */
  fontSize?: number;
  /** Tab size (spaces) */
  tabSize?: number;
  /** Word wrap mode */
  wordWrap?: "on" | "off" | "wordWrapColumn" | "bounded";
  /** Auto-focus editor on mount */
  autoFocus?: boolean;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Additional Monaco editor options */
  options?: editor.IStandaloneEditorConstructionOptions;
  /** Called when editor mounts */
  onMount?: (editor: editor.IStandaloneCodeEditor) => void;
}

// Default Python starter code
const DEFAULT_PYTHON_CODE = `# Welcome to Visual Python Learning!
# Start writing your Python code here.

def hello_world():
    """A simple greeting function."""
    message = "Hello, World!"
    print(message)
    return message

# Call the function
result = hello_world()
print(f"Function returned: {result}")
`;

export function CodeEditor({
  defaultValue,
  value,
  onChange,
  language = "python",
  theme = "vs-dark",
  height = "100%",
  readOnly = false,
  lineNumbers = "on",
  minimap = true,
  fontSize = 14,
  tabSize = 4,
  wordWrap = "on",
  autoFocus = true,
  placeholder,
  options = {},
  onMount,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Handle editor mount
  const handleEditorMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

      // Configure Python-specific settings
      if (language === "python") {
        // Set Python indentation rules
        monaco.languages.setLanguageConfiguration("python", {
          indentationRules: {
            increaseIndentPattern: /^.*:\s*$/,
            decreaseIndentPattern: /^\s*(elif|else|except|finally)\b.*:\s*$/,
          },
          onEnterRules: [
            {
              // After a line ending with colon, increase indent
              beforeText: /:\s*$/,
              action: {
                indentAction: monaco.languages.IndentAction.Indent,
              },
            },
          ],
        });
      }

      // Add custom keyboard shortcuts
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        // Prevent browser save dialog, trigger custom save
        console.log("Save triggered - code:", editor.getValue());
      });

      // Auto-focus if requested
      if (autoFocus) {
        editor.focus();
      }

      // Call external onMount handler
      onMount?.(editor);
    },
    [language, autoFocus, onMount]
  );

  // Handle code changes
  const handleChange: OnChange = useCallback(
    (newValue) => {
      onChange?.(newValue || "");
    },
    [onChange]
  );

  // Determine the initial value
  const initialValue = value ?? defaultValue ?? (language === "python" ? DEFAULT_PYTHON_CODE : "");

  // Merge default options with custom options
  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    // Basic settings
    readOnly,
    fontSize,
    tabSize,
    lineNumbers,
    wordWrap,
    
    // UI settings
    minimap: { enabled: minimap },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    
    // Python-friendly settings
    insertSpaces: true,
    detectIndentation: false,
    
    // Enhanced editing features
    folding: true,
    foldingStrategy: "indentation",
    showFoldingControls: "always",
    
    // Bracket handling
    bracketPairColorization: { enabled: true },
    matchBrackets: "always",
    autoClosingBrackets: "always",
    autoClosingQuotes: "always",
    
    // Selection and cursor
    cursorBlinking: "smooth",
    cursorSmoothCaretAnimation: "on",
    smoothScrolling: true,
    
    // Code suggestions
    quickSuggestions: true,
    suggestOnTriggerCharacters: true,
    
    // Accessibility
    accessibilitySupport: "auto",
    
    // Rulers for Python PEP 8 (79 characters)
    rulers: language === "python" ? [79, 120] : [],
    
    // Render settings
    renderWhitespace: "selection",
    renderLineHighlight: "all",
    
    // Scrollbar
    scrollbar: {
      useShadows: false,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
    },
    
    // Padding
    padding: { top: 16, bottom: 16 },
    
    // Override with custom options
    ...options,
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg border border-secondary-700">
      <Editor
        height={height}
        language={language}
        theme={theme}
        value={value}
        defaultValue={initialValue}
        onChange={handleChange}
        onMount={handleEditorMount}
        options={editorOptions}
        loading={
          <div className="flex items-center justify-center h-full bg-secondary-900">
            <div className="text-center">
              <Spinner size="lg" variant="primary" />
              <p className="mt-4 text-secondary-400">Loading editor...</p>
            </div>
          </div>
        }
      />
      
      {/* Placeholder overlay when empty */}
      {placeholder && !value && !defaultValue && (
        <div className="absolute top-4 left-16 text-secondary-500 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
}

// Export utility functions for external use
export function getEditorValue(editor: editor.IStandaloneCodeEditor | null): string {
  return editor?.getValue() || "";
}

export function setEditorValue(
  editor: editor.IStandaloneCodeEditor | null,
  value: string
): void {
  editor?.setValue(value);
}

export function formatCode(editor: editor.IStandaloneCodeEditor | null): void {
  editor?.getAction("editor.action.formatDocument")?.run();
}

export default CodeEditor;
