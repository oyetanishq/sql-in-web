import { useState, useEffect } from "react";
import initSqlJs, { Database } from "sql.js";

import Editor from "react-simple-code-editor";

import { highlight, languages } from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism.css";

import dummySqlFile from "/dummy.sqlite?url";
import sqlWasm from "/sql-wasm.wasm?url";

function App() {
	const [db, setDb] = useState<Database | null>(null);
	const [code, setCode] = useState<string>("SELECT * FROM students;");

	useEffect(() => {
		(async () => {
			const sqlPromise = initSqlJs({ locateFile: () => sqlWasm });
			const dataPromise = fetch(dummySqlFile).then((res) =>
				res.arrayBuffer()
			);

			const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
			setDb(new SQL.Database(new Uint8Array(buf)));
		})();
	}, []);

	useEffect(() => {
		if (!db) return;

		(window as any).db = db;
		const { values } = db.exec("SELECT * FROM students;")[0];
		console.table(values);
	}, [db]);

	return (
		<div className="flex justify-center items-center min-h-[100dvh] w-full">
			<nav className="h-[100dvh] w-16 flex justify-center items-center">
				<span onClick={() => {
					try {
						db && alert(JSON.stringify(db.exec(code)));
					} catch (e) {
						alert((e as any).message)
					}
				}}>RUN</span>
			</nav>
			<main className="h-[100dvh] w-[calc(100%-4rem)] flex justify-center items-center">
				<Editor
					className="h-full w-full"
					value={code}
					onValueChange={setCode}
					highlight={(code) => highlight(code, languages.sql, "sql")}
					padding={15}
					style={{
						fontFamily: '"Fira code", "Fira Mono", monospace',
					}}
					tabSize={4}
				/>
			</main>
		</div>
	);
}

export default App;
