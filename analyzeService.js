const Papa = require("papaparse");
const XLSX = require("xlsx");

/**
 * DATA ANALYSIS - REAL implementation (no external AI provider needed).
 * Parses CSV/XLSX buffers, computes missing values, basic statistics,
 * and a simple correlation matrix for numeric columns.
 */

function parseFile(buffer, originalName) {
  const isCsv = originalName.toLowerCase().endsWith(".csv");

  if (isCsv) {
    const text = buffer.toString("utf-8");
    const parsed = Papa.parse(text, { header: true, dynamicTyping: true, skipEmptyLines: true });
    return parsed.data;
  }

  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json(sheet, { defval: null });
}

function isNumeric(value) {
  return typeof value === "number" && !Number.isNaN(value);
}

function computeColumnStats(rows, column) {
  const values = rows.map((r) => r[column]);
  const missing = values.filter((v) => v === null || v === undefined || v === "").length;
  const numericValues = values.filter(isNumeric);

  const stats = {
    column,
    totalRows: values.length,
    missingCount: missing,
    missingPercent: values.length ? Number(((missing / values.length) * 100).toFixed(2)) : 0,
    isNumeric: numericValues.length > 0 && numericValues.length >= values.length * 0.6,
  };

  if (stats.isNumeric && numericValues.length) {
    const sorted = [...numericValues].sort((a, b) => a - b);
    const sum = numericValues.reduce((a, b) => a + b, 0);
    const mean = sum / numericValues.length;
    const variance =
      numericValues.reduce((acc, v) => acc + (v - mean) ** 2, 0) / numericValues.length;

    stats.min = sorted[0];
    stats.max = sorted[sorted.length - 1];
    stats.mean = Number(mean.toFixed(3));
    stats.median = sorted[Math.floor(sorted.length / 2)];
    stats.stdDev = Number(Math.sqrt(variance).toFixed(3));
  } else {
    const uniqueValues = new Set(values.filter((v) => v !== null && v !== undefined && v !== ""));
    stats.uniqueCount = uniqueValues.size;
  }

  return stats;
}

function pearsonCorrelation(x, y) {
  const n = x.length;
  if (n === 0) return 0;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let denX = 0;
  let denY = 0;
  for (let i = 0; i < n; i += 1) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  const den = Math.sqrt(denX * denY);
  return den === 0 ? 0 : Number((num / den).toFixed(3));
}

function computeCorrelationMatrix(rows, numericColumns) {
  const matrix = {};
  for (const colA of numericColumns) {
    matrix[colA] = {};
    for (const colB of numericColumns) {
      const pairedRows = rows.filter((r) => isNumeric(r[colA]) && isNumeric(r[colB]));
      const x = pairedRows.map((r) => r[colA]);
      const y = pairedRows.map((r) => r[colB]);
      matrix[colA][colB] = x.length ? pearsonCorrelation(x, y) : 0;
    }
  }
  return matrix;
}

function generateInsights(columnStats, rowCount) {
  const insights = [];
  insights.push(`Dataset has ${rowCount} rows and ${columnStats.length} columns.`);

  const highMissing = columnStats.filter((c) => c.missingPercent > 20);
  if (highMissing.length) {
    insights.push(
      `Columns with significant missing data (>20%): ${highMissing.map((c) => c.column).join(", ")}.`
    );
  }

  const numericCols = columnStats.filter((c) => c.isNumeric);
  if (numericCols.length) {
    const widestSpread = [...numericCols].sort(
      (a, b) => b.max - b.min - (a.max - a.min)
    )[0];
    if (widestSpread) {
      insights.push(
        `"${widestSpread.column}" has the widest value range (${widestSpread.min} to ${widestSpread.max}).`
      );
    }
  }

  if (!numericCols.length) {
    insights.push("No numeric columns were detected for statistical analysis.");
  }

  return insights;
}

async function analyzeDataset(buffer, originalName) {
  const rows = parseFile(buffer, originalName);
  if (!rows.length) {
    return { status: "error", data: null, message: "The file appears to be empty or unreadable." };
  }

  const columns = Object.keys(rows[0]);
  const columnStats = columns.map((col) => computeColumnStats(rows, col));
  const numericColumns = columnStats.filter((c) => c.isNumeric).map((c) => c.column);
  const correlation = numericColumns.length > 1 ? computeCorrelationMatrix(rows, numericColumns) : null;
  const insights = generateInsights(columnStats, rows.length);

  return {
    status: "ok",
    data: {
      rowCount: rows.length,
      columns,
      preview: rows.slice(0, 20),
      columnStats,
      correlation,
      insights,
    },
    message: "ok",
  };
}

module.exports = { analyzeDataset };
