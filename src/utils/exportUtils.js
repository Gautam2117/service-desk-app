// src/utils/exportUtils.js
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportToCSV = (tickets) => {
  const csv = Papa.unparse(
    tickets.map(({ title, description, status, priority, category }) => ({
      title,
      description,
      status,
      priority,
      category,
    }))
  );
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tickets.csv";
  a.click();
};

export const exportToPDF = (tickets) => {
  const doc = new jsPDF();

  console.log("✅ autoTable available:", typeof doc.autoTable); // Should log: function

  const rows = tickets.map(({ title, status, priority, category }) => [
    title,
    status,
    priority,
    category,
  ]);

  doc.autoTable({
    head: [["Title", "Status", "Priority", "Category"]],
    body: rows,
    styles: { fontSize: 10 },
    margin: { top: 20 },
  });

  doc.save("tickets.pdf");
};
