import MonacoEditor from "@monaco-editor/react";
import githubTheme from "monaco-themes/themes/Chrome DevTools.json";

interface Params {
	value: string;
	onChange: Function;
}

export default function CodeEditorForDesktop({ value, onChange }: Params) {
	return <MonacoEditor language="sql" height="100%" width="100%" value={value} onChange={(vale) => vale && onChange(vale)} beforeMount={(monacoInstance) => monacoInstance.editor.defineTheme("custom-theme", githubTheme)} theme="custom-theme" />;
}
