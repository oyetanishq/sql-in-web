import { useState, useEffect } from "react";
import initSqlJs, { Database, QueryExecResult } from "sql.js";
import classNames from "classnames";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism-dark.css";

import dummySqlFile from "/dummy.sqlite?url";
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
		active: false,
		name: "All Students",
		code: "SELECT * FROM students;",
	},
	{
		id: 2,
		active: false,
		name: "All Courses",
		code: "SELECT * FROM courses;",
	},
	{
		id: 3,
		active: true,
		name: "Students & Courses",
		code: "SELECT * FROM courses NATURAL JOIN students;",
	},
];

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
			<nav className="h-[100dvh] w-16 flex justify-center items-center border-r border-r-rose-200">
				<span
					onClick={() => {
						try {
							if (!db) return;
							tabs.forEach(({ active, code }) => active && setData(db.exec(code)[0]));
						} catch (e) {
							alert((e as any).message);
						}
					}}
					className="cursor-pointer"
				>
					RUN
				</span>
			</nav>
			<main className="h-[100dvh] w-[calc(100%-4rem)] flex justify-center items-center flex-col">
				<section className="h-2/3 w-full">
					<div className="w-full h-full p-2 pl-0">
						<div className="flex h-20 w-full"></div>
						<div className="border-b border-rose-200 flex gap-x-4 h-12 pl-8 justify-start items-center overflow-x-scroll hide-scrollbar">
							{tabs.map(({ id, name, active }) => {
								return (
									<button
										type="button"
										key={id}
										onClick={() => setTabs((tab) => tab.map(({ id: ID, name, code }) => ({ id: ID, name, active: ID == id, code })))}
										onDoubleClick={() => console.log("change name request")}
										className={classNames("h-full min-w-36 flex justify-center items-center px-4 text-sm font-medium text-center border text-gray-600 rounded-t-lg hover:text-gray-800 border-b-0", active ? "bg-rose-50 border-rose-300" : "border-rose-200")}
									>
										{name}
									</button>
								);
							})}
							<span
								className="mx-4 hover:rotate-90 transition duration-300 cursor-pointer min-h-6 min-w-6 rounded-md bg-rose-300 hover:bg-rose-400 text-red-600 hover:text-red-700 flex justify-center items-center font-semibold"
								onClick={() => setTabs((tabs) => [...tabs, { id: tabs.length + 1, active: false, name: "New Tab", code: "" }])}
							>
								+
							</span>
						</div>

						<div className="mt-3 h-[calc(100%-8rem)] w-full">
							{tabs.map(({ id, code, active }) => {
								return (
									<div key={id} className={classNames("flex w-full h-full", active ? "" : "hidden")}>
										<Editor
											className="h-full w-full editor"
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
				</section>
				<div className="h-1/3 overflow-x-auto w-full p-3 border-t border-t-rose-200">
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
				</div>
			</main>
		</div>
	);
}

export default App;
