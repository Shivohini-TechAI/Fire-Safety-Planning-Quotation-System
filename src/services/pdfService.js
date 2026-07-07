function formatCurrency(value) {
  const numericValue = Number(value ?? 0);
  return `₹${numericValue.toFixed(2)}`;
}

function parseCurrency(value) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const normalizedValue = value.replace(/[₹,]/g, "").trim();
    return Number(normalizedValue) || 0;
  }

  return Number(value) || 0;
}

function parseBreakdownFromDescription(description) {
  if (typeof description !== "string" || description.trim() === "") {
    return [];
  }

  const lines = description.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => line.trim().startsWith("3. Itemized Equipment Cost"));

  if (startIndex === -1) {
    return [];
  }

  const breakdown = [];

  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const trimmedLine = lines[index].trim();
    if (trimmedLine === "" || trimmedLine.startsWith("4.")) {
      break;
    }

    const match = trimmedLine.match(/^- (.+) \| Qty: (\d+) \| Unit Price: (.+) \| Total: (.+)$/);
    if (match) {
      breakdown.push({
        name: match[1],
        quantity: Number(match[2]),
        unitPrice: parseCurrency(match[3]),
        itemTotal: parseCurrency(match[4]),
      });
    }
  }

  return breakdown;
}

function buildQuotationBreakdownRows(quotation) {
  const rows = [];
  const breakdown = Array.isArray(quotation.breakdown) && quotation.breakdown.length > 0
    ? quotation.breakdown
    : parseBreakdownFromDescription(quotation.description || "");

  if (breakdown.length > 0) {
    breakdown.forEach((item) => {
      rows.push({
        type: "item",
        title: item.name,
        detail: `${item.quantity} x ${formatCurrency(item.unitPrice)}`,
        amount: item.itemTotal,
      });
    });
  }

  rows.push(
    { type: "summary", title: "Equipment Cost", amount: quotation.equipmentCost },
    { type: "summary", title: "Installation Cost", amount: quotation.installationCost },
    { type: "summary", title: "Maintenance Cost", amount: quotation.maintenanceCost },
    { type: "summary", title: "GST", amount: quotation.gst },
    { type: "total", title: "Total Estimated Cost", amount: quotation.totalCost }
  );

  return rows;
}

function writeQuotationPdf(doc, quotation) {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  doc.fillColor("#111827");
  doc.font("Helvetica-Bold").fontSize(24).text("QUOTATION", margin, 40);
  doc.font("Helvetica").fontSize(11).fillColor("#6b7280").text(
    "Fire Safety Planning Quotation System",
    margin,
    70
  );

  doc.roundedRect(margin - 10, 30, contentWidth + 20, 80, 8).fillAndStroke(
    "#f8fafc",
    "#dbe3ea"
  );
  doc.fillColor("#0f4c81").font("Helvetica-Bold").fontSize(15).text(
    "Professional Fire Safety Cost Estimate",
    margin,
    45
  );

  doc.fillColor("#374151").font("Helvetica").fontSize(10);
  doc.text(`Quotation No: ${quotation.id}`, pageWidth - margin - 165, 45);
  doc.text(`Project: ${quotation.projectName}`, pageWidth - margin - 165, 60);
  doc.text(
    `Date: ${new Date(quotation.createdAt).toLocaleDateString()}`,
    pageWidth - margin - 165,
    75
  );
  doc.text("Status: Draft", pageWidth - margin - 165, 90);

  doc.moveTo(margin, 130).lineTo(pageWidth - margin, 130).strokeColor("#d1d5db").lineWidth(1).stroke();

  doc.roundedRect(margin, 140, contentWidth, 70, 6).fillAndStroke("#f9fbfd", "#dbe3ea");
  doc.fillColor("#111827").font("Helvetica-Bold").fontSize(12).text(
    "Project Details",
    margin + 12,
    152
  );
  doc.font("Helvetica").fontSize(10).fillColor("#374151");
  doc.text(`Client / Site: ${quotation.projectName}`, margin + 12, 172);
  doc.text(`Reference ID: ${quotation.id}`, margin + 12, 187);
  doc.text(`Issued On: ${new Date(quotation.createdAt).toLocaleDateString()}`, margin + 280, 172);
  doc.text("Prepared For: Fire Safety Planning Team", margin + 280, 187);

  const tableTop = 230;
  const rowHeight = 30;
  const firstColWidth = contentWidth * 0.7;

  doc.roundedRect(margin, tableTop, contentWidth, rowHeight, 4).fillAndStroke("#e8f2fb", "#c7dced");
  doc.fillColor("#0f4c81").font("Helvetica-Bold").fontSize(10);
  doc.text("Item / Description", margin + 10, tableTop + 8);
  doc.text("Amount", margin + firstColWidth + 10, tableTop + 8);

  const rows = buildQuotationBreakdownRows(quotation);

  let currentY = tableTop + rowHeight;
  rows.forEach((row, index) => {
    const fillColor = row.type === "total" ? "#fef3c7" : index % 2 === 0 ? "#ffffff" : "#f9fbfd";
    const strokeColor = row.type === "total" ? "#f59e0b" : "#e5e7eb";
    doc.roundedRect(margin, currentY, contentWidth, rowHeight, 3).fillAndStroke(fillColor, strokeColor);
    doc.fillColor(row.type === "total" ? "#92400e" : "#374151").font(row.type === "total" ? "Helvetica-Bold" : "Helvetica").fontSize(10);
    doc.text(row.title, margin + 10, currentY + 8);
    if (row.type === "item") {
      doc.font("Helvetica").fontSize(9).fillColor("#6b7280");
      doc.text(row.detail, margin + 10, currentY + 18, { width: firstColWidth - 20 });
      doc.fillColor("#374151").font("Helvetica").fontSize(10);
    }
    doc.text(formatCurrency(row.amount), margin + firstColWidth + 10, currentY + 8);
    currentY += rowHeight;
  });

  const notesY = currentY + rowHeight + 30;
  doc.roundedRect(margin, notesY, contentWidth, 90, 6).fillAndStroke("#fcfdff", "#e5e7eb");
  doc.fillColor("#111827").font("Helvetica-Bold").fontSize(11).text("Notes", margin + 12, notesY + 12);
  doc.font("Helvetica").fontSize(10).fillColor("#4b5563");
  doc.text(
    "This quotation is prepared based on the requested scope and may be revised if project requirements change.",
    margin + 12,
    notesY + 35,
    { width: contentWidth - 24 }
  );
  doc.text(
    "Thank you for choosing Fire Safety Planning Quotation System.",
    margin + 12,
    notesY + 55,
    { width: contentWidth - 24 }
  );

  const signY = notesY + 115;
  doc.strokeColor("#d1d5db").lineWidth(1);
  doc.moveTo(margin + 20, signY).lineTo(margin + 180, signY).stroke();
  doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text(
    "Authorized Signature",
    margin + 20,
    signY + 8
  );

  doc.moveTo(pageWidth - margin - 180, signY).lineTo(pageWidth - margin - 20, signY).stroke();
  doc.text(
    "Client Confirmation",
    pageWidth - margin - 180,
    signY + 8
  );

  doc.moveTo(margin, pageHeight - 55).lineTo(pageWidth - margin, pageHeight - 55).strokeColor("#d1d5db").lineWidth(1).stroke();
  doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text(
    "Generated by Fire Safety Planning Quotation System",
    margin,
    pageHeight - 40,
    { align: "center", width: contentWidth }
  );
}

module.exports = {
  buildQuotationBreakdownRows,
  parseBreakdownFromDescription,
  writeQuotationPdf,
};
