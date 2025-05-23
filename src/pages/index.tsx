import { useState, useEffect } from "react";
import { QueryExecResult } from "sql.js";
import QueryTable from "@components/query-table";
import CodeEditor, { Tab } from "@components/code-editor/index";
import saveSqlJsDatabase from "@lib/save-file";
import { useTabsStore } from "@store/tabs";
import { useDatabaseStore } from "@store/database";

export default function Home() {
	const [data, setData] = useState<QueryExecResult>();
	const [tabs, setTabs] = useState<Tab[]>([]);
	const { updateAllTabs, data: tabsData } = useTabsStore();
	const { db, runQuery, exportDb, initDb } = useDatabaseStore();

	useEffect(() => {
		updateAllTabs(tabs);
	}, [tabs]);

	useEffect(() => {
		(async () => {
			await initDb();
			const tabsFromStore = Object.values(tabsData);
			setTabs(tabsFromStore);
			try {
				tabsFromStore.forEach(({ active, code }) => active && setData(runQuery(code)[0]));
			} catch (error) {
				alert((error as any).message);
			}
		})();
	}, []);

	return (
		<div className="flex justify-center items-center min-h-[100dvh] w-full">
			<main className="h-[100dvh] w-full flex justify-center items-center flex-col">
				<section className="h-2/3 w-full overflow-hidden">
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
									tabs.forEach(({ active, code }) => active && setData(runQuery(code)[0]));
								} catch (e) {
									alert((e as any).message);
								}
							}}
						>
							RUN QUERY
						</div>
					</div>

					<CodeEditor tabs={tabs} setTabs={setTabs} className="w-full h-[calc(100%-8rem)]" />
				</section>

				<section className="h-1/3 overflow-x-auto w-full p-4 border-t border-t-rose-200 backdrop-blur-md relative">
					<div
						className="before:content-['Export_DB'] z-999 before:absolute before:bottom-3 before:right-3 before:px-3 before:py-2 before:transition before:duration-300 before:cursor-pointer before:border before:rounded-sm before:border-rose-300 before:hover:border-rose-400 before:active:border-rose-500 before:text-gray-600 before:hover:text-gray-900 before:active:text-black before:bg-rose-100 before:hover:bg-rose-300 before:active:bg-rose-400"
						onClick={() => db && saveSqlJsDatabase(exportDb())}
					/>
					{data && <QueryTable query={data} />}
				</section>
			</main>
		</div>
	);
}
