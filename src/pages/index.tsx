import { useState, useEffect } from "react";
import initSqlJs, { Database } from "sql.js";

function App() {
	const [db, setDb] = useState<Database | null>(null);

	useEffect(() => {
		(async () =>
			setDb(
				new (
					await initSqlJs({
						locateFile: () =>
							"https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.wasm",
					})
				).Database()
			))();
	}, []);

	return (
		<div className="flex justify-center items-center h-full w-full">
			{db && "aagaya"}
		</div>
	);
}

export default App;
