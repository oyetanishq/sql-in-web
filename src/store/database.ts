import { create } from "zustand";
import initSqlJs, { Database, QueryExecResult } from "sql.js";
import sqlWasm from "/sql-wasm.wasm?url";
import dummySqlFile from "/database.sql?url";

const LOCAL_STORAGE_KEY = "sqljs_database";

interface DatabaseState {
	db: Database | null;
	initDb: () => Promise<void>;
	runQuery: (query: string) => QueryExecResult[];
	exportDb: () => Uint8Array;
	persistDb: () => void;
	resetDb: () => void;
}

export const useDatabaseStore = create<DatabaseState>((set, get) => ({
	db: null,

	initDb: async () => {
		const SQL = await initSqlJs({ locateFile: () => sqlWasm });
		let db: Database;
		const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (stored) {
			const binaryString = atob(stored);
			const len = binaryString.length;
			const bytes = new Uint8Array(len);
			for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

			db = new SQL.Database(bytes);
		} else {
			const dataBuffer = await fetch(dummySqlFile).then((res) => res.arrayBuffer());
			db = new SQL.Database(new Uint8Array(dataBuffer));
		}
		set({ db });
	},

	runQuery: (query: string) => {
		const { db, persistDb } = get();
		if (!db) throw new Error("Database not initialized");

		const result = db.exec(query);
		persistDb();
		return result;
	},

	exportDb: () => {
		const { db } = get();
		if (!db) throw new Error("Database not initialized");

		return db.export();
	},

	persistDb: () => {
		const { exportDb } = get();
		const data = exportDb();
		let binary = "";
		data.forEach((byte) => (binary += String.fromCharCode(byte)));
		const base64Data = btoa(binary);
		localStorage.setItem(LOCAL_STORAGE_KEY, base64Data);
	},

	resetDb: () => {
		localStorage.removeItem(LOCAL_STORAGE_KEY);
		localStorage.removeItem("sql-tabs");
		window.location.reload();
	},
}));
