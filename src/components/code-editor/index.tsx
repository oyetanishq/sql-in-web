import { Dispatch, SetStateAction, useState } from "react";
import classNames from "classnames";
import { v4 as uuidV4 } from "uuid";

import isDesktopFn from "@lib/is-desktop";
import CodeEditorForDesktop from "@components/code-editor/desktop";
import CodeEditorForMobile from "@components/code-editor/mobile";
import { useDatabaseStore } from "@store/database";

export type Tab = {
	id: string;
	active: boolean;
	name: string;
	code: string;
};

export default function CodeEditor({ tabs, setTabs, className }: { tabs: Tab[]; setTabs: Dispatch<SetStateAction<Tab[]>>; className: string | undefined }) {
	const [isDesktop] = useState(isDesktopFn());
	const { resetDb } = useDatabaseStore();

	return (
		<div className={className}>
			<div className="flex h-12 justify-start items-center overflow-x-scroll hide-scrollbar">
				<div className="h-full min-w-4 border-b border-rose-200" />
				{tabs.map(({ id, name, active }, index) => {
					return (
						<>
							{index ? <div key={"tabs-button-space-" + id} className="h-full min-w-5 border-b border-rose-200" /> : ""}
							<button
								type="button"
								key={"tabs-button-" + id}
								onClick={() => setTabs((tab) => tab.map(({ id: ID, name, code }) => ({ id: ID, name, active: ID == id, code })))}
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
						onClick={() => setTabs((tabs) => [...tabs, { id: uuidV4(), active: false, name: prompt("Enter Tab Name", "New Tab") ?? "New Tab", code: "" }])}
					>
						+
					</label>
				</div>

				<div className="h-full flex justify-start items-center border-b border-rose-200 px-4">
					<button type="button" onClick={resetDb} className="transition duration-300 cursor-pointer bg-rose-50 border border-rose-200 hover:bg-rose-400 text-gray-600 hover:text-gray-800 flex justify-center items-center p-1 px-2">
						reset
					</button>
				</div>
			</div>

			<div className="mt-3 h-[calc(100%-3rem)] w-full">
				{tabs.map(({ id, code, active }) => {
					const onCodeChange = (newCode: string) => setTabs((tab) => tab.map(({ id: ID, name, code }) => ({ id: ID, name, active: ID == id, code: ID == id ? newCode : code })));

					return (
						<div key={"editor-tab-group-" + id} className={classNames(active ? "" : "hidden", "overflow-scroll h-full w-full hide-scrollbar")}>
							{isDesktop ? <CodeEditorForDesktop key={"editor-tab-" + id} value={code} onChange={onCodeChange} /> : <CodeEditorForMobile key={"editor-tab-" + id} value={code} onChange={onCodeChange} />}
						</div>
					);
				})}
			</div>
		</div>
	);
}
