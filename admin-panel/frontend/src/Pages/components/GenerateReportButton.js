import React from 'react';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const GenerateReportButton = ({ data, columns, title }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(title || 'Report', 14, 22);

    const rows = data.map((item) =>
      columns.map((col) => typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor])
    );

    doc.autoTable({
      head: [columns.map((col) => col.label)],
      body: rows,
      startY: 30,
    });

    doc.save(`${title || 'report'}.pdf`);
  };

  return (
    <Button variant="contained" color="primary" onClick={exportToPDF}>
      Export as PDF
    </Button>
  );
};

export default GenerateReportButton;
