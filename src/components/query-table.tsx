import { QueryExecResult } from "sql.js";

export default function QueryTable({ query }: { query: QueryExecResult; }) {
	return (
		<div className="h-full w-full overflow-scroll hide-scrollbar">
			<table className="min-w-full divide-y-2 divide-[#ffecf4b8] bg-[#ffecf42e] pb-3 text-sm border border-red-100 border-collapse selection:bg-red-200 cursor-pointer">
				<thead className="sticky top-0 bg-[#ffecf4a6] backdrop-blur-md">
					<tr>
						{query?.columns.map((value, index) => {
							return (
								<th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left " key={index}>
									<b>{value}</b>
								</th>
							);
						})}
					</tr>
				</thead>

				<tbody className="divide-y divide-[#ffecf4b8]">
					{query?.values.map((row, index1) => {
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
	);
}
