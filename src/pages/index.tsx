import { useState, useEffect } from "react";
import initSqlJs, { Database, QueryExecResult } from "sql.js";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism-dark.css";

import dummySqlFile from "/dummy.sqlite?url";
import sqlWasm from "/sql-wasm.wasm?url";

function App() {
	const [db, setDb] = useState<Database | null>(null);
	const [data, setData] = useState<QueryExecResult>();
	const [code, setCode] = useState<string>(
		"SELECT * FROM courses NATURAL JOIN students;"
	);

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

	return (
		<div className="flex justify-center items-center min-h-[100dvh] w-full">
			<nav className="h-[100dvh] w-16 flex justify-center items-center cursor-pointer">
				<span
					onClick={() => {
						try {
							db && setData(db.exec(code)[0]);
						} catch (e) {
							alert((e as any).message);
						}
					}}
				>
					RUN
				</span>
			</nav>
			<main className="h-[100dvh] w-[calc(100%-4rem)] flex justify-center items-center flex-col">
				<section className="h-2/3 w-full">
					<div className="h-full w-full">
						<Editor
							className="h-full w-full editor"
							value={code}
							onValueChange={setCode}
							highlight={(code) =>
								highlight(code, languages.sql, "sql")
									.split("\n")
									.map(
										(line, i) =>
											`<span class='editorLineNumber'>${
												i + 1
											}</span>${line}`
									)
									.join("\n")
							}
							textareaId="codeArea"
							padding={15}
							style={{
								fontFamily:
									'"Fira code", "Fira Mono", monospace',
								fontSize: 12,
								outline: 0,
							}}
							tabSize={4}
						/>
					</div>
				</section>
				<div className="h-1/3 overflow-x-auto w-full px-3 pb-3">
					<table className="min-w-full divide-y-2 divide-[#ffecf4b8] bg-[#ffecf42e] text-sm border border-red-100 border-collapse selection:bg-red-200 cursor-pointer">
						<thead className="sticky top-0 bg-[#ffecf4a6] backdrop-blur-md">
							<tr>
								{data?.columns.map((value, index) => {
									return (
										<th
											className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left "
											key={index}
										>
											{value}
										</th>
									);
								})}
							</tr>
						</thead>

						<tbody className="divide-y divide-[#ffecf4b8]">
							{data?.values.map((row, index1) => {
								return (
									<tr className="odd:bg-gray-50" key={index1}>
										{row.map((value, index2) => {
											return (
												<td
													className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 hover:bg-[#ffecf4]"
													key={index2}
												>
													{value}
												</td>
											);
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</main>
		</div>
	);
}

export default App;
