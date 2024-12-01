import { useState, useEffect } from "react";
import initSqlJs, { Database } from "sql.js";

import dummySqlFile from "/dummy.sqlite?url";
import sqlWasm from "/sql-wasm.wasm?url";

function App() {
	const [db, setDb] = useState<Database | null>(null);

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
		(window as any).db = db;
	}, [db]);

	return (
		<div className="flex justify-center items-center h-full w-full">
			{db && "aagaya"}
		</div>
	);
}

export default App;
