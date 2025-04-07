import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism-dark.css";

interface Params {
	value: string;
	onChange: Function;
}

export default function CodeEditorForMobile({ value, onChange }: Params) {
	return (
		<Editor
			className="editor"
			value={value}
			onValueChange={(value) => onChange(value)}
			highlight={(code) =>
				highlight(code, languages.sql, "sql")
					.split("\n")
					.map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
					.join("\n")
			}
			padding={15}
			tabSize={4}
		/>
	);
}
