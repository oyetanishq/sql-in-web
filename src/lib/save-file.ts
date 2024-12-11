export default function saveSqlJsDatabase (dbExportedData: BlobPart, fileName = "database.sql") {
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
