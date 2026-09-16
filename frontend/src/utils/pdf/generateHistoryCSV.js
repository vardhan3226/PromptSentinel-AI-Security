export const generateHistoryCSV = (history = []) => {
  /*
  |--------------------------------------------------------------------------
  | CSV Escape Helper
  |--------------------------------------------------------------------------
  |
  | Properly escapes commas, quotes, and line breaks so the generated
  | CSV remains valid when opened in Excel, Google Sheets, etc.
  |--------------------------------------------------------------------------
  */

  const escapeCSV = (value) => {
    if (value === null || value === undefined) {
      return '""';
    }

    const stringValue = String(value);

    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  /*
  |--------------------------------------------------------------------------
  | CSV Headers
  |--------------------------------------------------------------------------
  */

  const headers = [
    "Prompt",
    "Threat Level",
    "Attack Type",
    "Risk Score",
    "Confidence",
    "Recommendation",
    "Date",
  ];

  /*
  |--------------------------------------------------------------------------
  | CSV Rows
  |--------------------------------------------------------------------------
  */

  const rows = history.map((scan) => [
    escapeCSV(scan.prompt),

    escapeCSV(scan.threatLevel),

    escapeCSV(
      scan.attackType || "Safe Prompt"
    ),

    escapeCSV(
      `${scan.riskScore ?? 0}/100`
    ),

    escapeCSV(
      `${scan.confidence ?? 0}%`
    ),

    escapeCSV(
      scan.recommendation ||
      "No recommendation available."
    ),

    escapeCSV(
      scan.createdAt
        ? new Date(
            scan.createdAt
          ).toLocaleString()
        : ""
    ),
  ]);

  /*
  |--------------------------------------------------------------------------
  | Build CSV Content
  |--------------------------------------------------------------------------
  */

  const csvContent = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) =>
      row.join(",")
    ),
  ].join("\n");

  /*
  |--------------------------------------------------------------------------
  | Create CSV File
  |--------------------------------------------------------------------------
  */

  const blob = new Blob(
    [csvContent],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Download CSV
  |--------------------------------------------------------------------------
  */

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "PromptSentinel_History_Report.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  /*
  |--------------------------------------------------------------------------
  | Clean Up
  |--------------------------------------------------------------------------
  */

  URL.revokeObjectURL(url);
};