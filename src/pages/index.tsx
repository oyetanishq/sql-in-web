import { useState, useEffect } from "react";
import initSqlJs, { Database, QueryExecResult } from "sql.js";
import classNames from "classnames";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism-dark.css";

import dummySqlFile from "/database.sql?url";
import sqlWasm from "/sql-wasm.wasm?url";

type tab = {
	id: number;
	active: boolean;
	name: string;
	code: string;
};

const exampleTabs: tab[] = [
	{
		id: 1,
		active: true,
		name: "All Students",
		code: "SELECT\n    CONCAT(firstName, ' ' ,lastName) AS 'Full Name',\n    gender,\n    email,\n    image\n\nFROM students;\n",
	},
	{
		id: 2,
		active: false,
		name: "All Tables",
		code: "SELECT name FROM sqlite_master WHERE type='table';\n\n-- Describe Table\n-- pragma table_info(table_name)\n",
	},
];

const saveSqlJsDatabase = (dbExportedData: BlobPart, fileName = "database.sql") => {
	const blob = new Blob([dbExportedData], { type: "application/octet-stream" });
	const url = URL.createObjectURL(blob);

	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = fileName;

	document.body.appendChild(anchor);
	anchor.click();

	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
};

function App() {
	const [db, setDb] = useState<Database | null>(null);
	const [data, setData] = useState<QueryExecResult>();
	const [tabs, setTabs] = useState<tab[]>(exampleTabs);

	useEffect(() => {
		(async () => {
			const sqlPromise = initSqlJs({ locateFile: () => sqlWasm });
			const dataPromise = fetch(dummySqlFile).then((res) => res.arrayBuffer());

			const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
			const db = new SQL.Database(new Uint8Array(buf));

			tabs.forEach(({ active, code }) => active && setData(db.exec(code)[0]));
			setDb(db);
		})();
	}, []);

	return (
		<div className="flex justify-center items-center min-h-[100dvh] w-full">
			<main className="h-[100dvh] w-full flex justify-center items-center flex-col">
				<section className="h-2/3 w-full relative">
					<div className="w-full h-full">
						<div className="h-32 w-full flex justify-between items-center px-4">
							<div className="h-full flex justify-center items-center">
								<img src="/sql-in-web.png" alt="sql in web png" className="h-1/2 rounded-md border border-rose-300" />
								<a href="/" className="ml-8 font-semibold italic text-xl hover:text-rose-400 cursor-pointer underline underline-offset-2 duration-300 transition">
									sql in web
								</a>
							</div>
							<div
								className="px-3 py-2 text-gray-600 hover:text-gray-900 active:text-black border border-rose-300 hover:border-rose-400 active:border-rose-500 rounded-sm bg-rose-100 hover:bg-rose-300 active:bg-rose-400  transition duration-300 cursor-pointer flex justify-center items-center"
								onClick={() => {
									try {
										if (!db) return;
										tabs.forEach(({ active, code }) => active && setData(db.exec(code)[0]));
									} catch (e) {
										alert((e as any).message);
									}
								}}
							>
								RUN QUERY
							</div>
						</div>

						<div className="flex h-12 justify-start items-center overflow-x-scroll hide-scrollbar">
							<div className="h-full min-w-4 border-b border-rose-200" />
							{tabs.map(({ id, name, active }, index) => {
								return (
									<>
										{index ? <div key={Math.random() * 10} className="h-full min-w-5 border-b border-rose-200" /> : ""}
										<button
											type="button"
											key={id}
											onClick={() => setTabs((tab) => tab.map(({ id: ID, name, code }) => ({ id: ID, name, active: ID == id, code })))}
											onDoubleClick={() => console.log("change name request")}
											className={classNames("h-full min-w-36 relative flex justify-center px-4 items-center text-sm font-medium text-center border border-rose-200 text-gray-600 rounded-t-lg hover:text-gray-800", active ? "border-b-0" : "bg-rose-50 border-b")}
										>
											{name}
										</button>
									</>
								);
							})}
							<div className="h-full flex-1 flex justify-start items-center border-b border-rose-200">
								<label
									className="mx-4 hover:rotate-90 transition duration-300 cursor-pointer h-6 w-6 rounded-md bg-rose-300 hover:bg-rose-400 text-red-600 hover:text-red-700 flex justify-center items-center font-semibold"
									onClick={() => setTabs((tabs) => [...tabs, { id: tabs.length + 1, active: false, name: prompt("Enter Tab Name", "New Tab") ?? "New Tab", code: "" }])}
								>
									+
								</label>
							</div>
						</div>

						<div className="mt-3 h-[calc(100%-11rem)] w-full">
							{tabs.map(({ id, code, active }) => {
								return (
									<div key={id} className={classNames(active ? "" : "hidden")}>
										<Editor
											className="editor"
											value={code}
											onValueChange={(newCode) => setTabs((tab) => tab.map(({ id: ID, name, code }) => ({ id: ID, name, active: ID == id, code: ID == id ? newCode : code })))}
											highlight={(code) =>
												highlight(code, languages.sql, "sql")
													.split("\n")
													.map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
													.join("\n")
											}
											padding={15}
											tabSize={4}
										/>
									</div>
								);
							})}
						</div>
					</div>
					<div
						className={classNames(
							"before:content-['Export_DB'] before:absolute before:bottom-3 before:right-3 before:px-3 before:py-2 before:transition before:duration-300 before:cursor-pointer",
							"before:border before:rounded-sm before:border-rose-300 before:hover:border-rose-400 before:active:border-rose-500",
							"before:text-gray-600 before:hover:text-gray-900 before:active:text-black",
							"before:bg-rose-100 before:hover:bg-rose-300 before:active:bg-rose-400",
							db ? "" : "before:hidden"
						)}
						onClick={() => db && saveSqlJsDatabase(db.export())}
					/>
				</section>
				<section className="h-1/3 overflow-x-auto w-full p-4 border-t border-t-rose-200">
					<div className="h-full w-full overflow-scroll hide-scrollbar">
						<table className="min-w-full divide-y-2 divide-[#ffecf4b8] bg-[#ffecf42e] pb-3 text-sm border border-red-100 border-collapse selection:bg-red-200 cursor-pointer">
							<thead className="sticky top-0 bg-[#ffecf4a6] backdrop-blur-md">
								<tr>
									{data?.columns.map((value, index) => {
										return (
											<th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left " key={index}>
												<b>{value}</b>
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
													<td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 hover:bg-[#ffecf4]" key={index2}>
														{value ?? "null"}
													</td>
												);
											})}
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</section>
			</main>
		</div>
	);
}

export default App;
