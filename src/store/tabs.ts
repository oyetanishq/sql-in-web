import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Tab } from "@components/code-editor/index";

type KeyValueStore = {
	data: Record<string, Tab>;
	addKeyValue: (key: string, value: Tab) => void;
	updateAllTabs: (tabs: Tab[]) => void;
	removeKey: (key: string) => void;
	clearAll: () => void;
	getAllKeys: () => string[];
};

export const useTabsStore = create<KeyValueStore>()(
	persist(
		(set, get) => ({
			data: {
				"12490d8c-ad13-4e4d-8668-f0b0ea5d4fbc": {
					id: "12490d8c-ad13-4e4d-8668-f0b0ea5d4fbc",
					active: true,
					name: "all-students.sql",
					code: "SELECT\n    students.id AS 'Student ID',\n    CONCAT(students.firstName, ' ', students.lastName) AS 'Full Name',\n    students.email AS 'Student Email',\n    GROUP_CONCAT(courses.code) AS 'Enrolled Courses',\n    SUM(courses.credits) AS 'Total Credits'\n\nFROM\n    students JOIN enrollments\n    ON(students.id = enrollments.student_id)\n    \n    JOIN courses\n    ON(courses.id = enrollments.course_id)\n    \nGROUP BY students.id\nORDER BY [Full Name] ASC;\n",
				},
				"6a79ede6-3d8c-41da-9f37-2926cd080453": {
					id: "6a79ede6-3d8c-41da-9f37-2926cd080453",
					active: false,
					name: "all-tabs.sql",
					code: "SELECT name FROM sqlite_master WHERE type='table';\n\n-- Describe Table\n-- pragma table_info(table_name)\n",
				},
			},
			addKeyValue: (key, value) =>
				set((state) => ({
					data: {
						...state.data,
						[key]: value,
					},
				})),
			updateAllTabs: (tabs: Tab[]) =>
				set(() => {
					const newData: Record<string, Tab> = {};
					tabs.forEach((tab) => {
						newData[tab.id] = tab;
					});
					return { data: newData };
				}),
			removeKey: (key) =>
				set((state) => {
					const newData = { ...state.data };
					delete newData[key];
					return { data: newData };
				}),
			clearAll: () => set({ data: {} }),
			getAllKeys: () => Object.keys(get().data),
		}),
		{
			name: "sql-tabs",
		}
	)
);
