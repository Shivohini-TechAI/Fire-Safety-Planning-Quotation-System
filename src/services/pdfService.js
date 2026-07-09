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
  {
    type: "subtotal",
    title: "Equipment Subtotal",
    amount: quotation.equipmentCost,
  },

  {
    type: "section",
    title: "Tax & Additional Charges",
  },

  {
    type: "summary",
    title: "Installation Cost (10%)",
    amount: quotation.installationCost,
  },

  {
    type: "summary",
    title: "Maintenance Cost (5%)",
    amount: quotation.maintenanceCost,
  },

  {
    type: "summary",
    title: "GST (18%)",
    amount: quotation.gst,
  },

  {
    type: "total",
    title: "Grand Total",
    amount: quotation.totalCost,
  }
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
    let fillColor = index % 2 === 0 ? "#ffffff" : "#f9fbfd";
    let strokeColor = "#e5e7eb";
    let textColor = "#374151";
    let font = "Helvetica";

    if (row.type === "subtotal") {
      fillColor = "#ecfdf5";
      strokeColor = "#86efac";
      textColor = "#166534";
      font = "Helvetica-Bold";
    }

    if (row.type === "section") {
      fillColor = "#dbeafe";
      strokeColor = "#93c5fd";
      textColor = "#1e40af";
      font = "Helvetica-Bold";
    }

    if (row.type === "total") {
      fillColor = "#fef3c7";
      strokeColor = "#f59e0b";
      textColor = "#92400e";
      font = "Helvetica-Bold";
    }

    doc
      .roundedRect(margin, currentY, contentWidth, rowHeight, 3)
      .fillAndStroke(fillColor, strokeColor);

    doc
      .fillColor(textColor)
      .font(font)
      .fontSize(10);

    doc.text(row.title, margin + 10, currentY + 8);

    if (row.type === "item") {
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#6b7280");

      doc.text(row.detail, margin + 10, currentY + 18, {
         width: firstColWidth - 20,
      });

      doc
        .fillColor(textColor)
        .font(font)
        .fontSize(10);
    }

    if (row.type !== "section") {
      doc.text(
        formatCurrency(row.amount),
        margin + firstColWidth + 10,
        currentY + 8
    );
}

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
function getFieldValue(source, keys) {
  const values = Array.isArray(keys) ? keys : [keys];

  for (const key of values) {
    if (typeof key !== "string") {
      continue;
    }

    if (key.includes(".")) {
      const parts = key.split(".");
      let current = source;
      let found = true;

      for (const part of parts) {
        if (current && Object.prototype.hasOwnProperty.call(current, part)) {
          current = current[part];
        } else {
          found = false;
          break;
        }
      }

      if (found && current !== undefined && current !== null && current !== "") {
        return current;
      }

      continue;
    }

    if (source && Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];
      if (value !== undefined && value !== null && value !== "") {
        return value;
      }
    }
  }

  return undefined;
}

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => item !== null && item !== undefined && item !== "");
  }

  if (value === null || value === undefined || value === "") {
    return [];
  }

  return [value];
}

function normalizeRecommendations(value) {
  return normalizeArray(value).map((item) => {
    if (typeof item === "string") {
      return {
        name: item,
        quantity: 1,
        zone: "Not specified",
      };
    }

    if (!item || typeof item !== "object") {
      return null;
    }

    return {
      name: getFieldValue(item, ["name", "equipmentName", "equipment", "itemName"]) || "Equipment",
      quantity: Number(getFieldValue(item, ["quantity", "qty", "count", "recommendedQuantity"]) || 1),
      zone: getFieldValue(item, ["zone", "equipmentZone", "location", "zoneName"]) || "Not specified",
    };
  }).filter(Boolean);
}

function normalizeFlags(value) {
  return normalizeArray(value).map((flag) => {
    if (typeof flag === "string") {
      return {
        severity: "Medium",
        reason: flag,
      };
    }

    if (!flag || typeof flag !== "object") {
      return null;
    }

    return {
      severity: getFieldValue(flag, ["severity", "level"]) || "Medium",
      reason: getFieldValue(flag, ["reason", "detail", "message", "description"]) || "Needs review",
    };
  }).filter(Boolean);
}

function normalizeRuleReferences(value) {
  return normalizeArray(value).map((rule) => {
    if (typeof rule === "string") {
      return {
        equipment: "General",
        code: rule,
        title: rule,
        reference: rule,
      };
    }

    if (!rule || typeof rule !== "object") {
      return null;
    }

    return {
      equipment: getFieldValue(rule, ["equipment", "equipmentName", "zone", "target"]) || "General",
      code: getFieldValue(rule, ["code", "referenceCode"]) || getFieldValue(rule, ["reference", "title"]) || "Reference",
      title: getFieldValue(rule, ["title", "name"]) || getFieldValue(rule, ["reference", "code"]) || "Reference",
      reference: getFieldValue(rule, ["reference", "detail"]) || getFieldValue(rule, ["code", "title"]) || "Reference",
    };
  }).filter(Boolean);
}

function ensureSpace(doc, requiredHeight, marginBottom = 70) {
  const pageHeight = doc.page.height;
  const bottomLimit = pageHeight - marginBottom;

  if (doc.y + requiredHeight > bottomLimit) {
    doc.addPage();
    doc.y = 50;
  }
}

function drawFooter(doc, margin, contentWidth) {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  doc.moveTo(margin, pageHeight - 55)
    .lineTo(pageWidth - margin, pageHeight - 55)
    .strokeColor("#d1d5db")
    .lineWidth(1)
    .stroke();

  doc.font("Helvetica")
    .fontSize(9)
    .fillColor("#6b7280")
    .text(
      "Generated by Fire Safety Planning Quotation System",
      margin,
      pageHeight - 40,
      {
        align: "center",
        width: contentWidth,
      }
    );
}

function drawTable(doc, headers, rows, columnWidths, options = {}) {
  const margin = options.margin || 50;
  const rowHeight = options.rowHeight || 22;
  const headerHeight = rowHeight + 6;
  const pageHeight = doc.page.height;
  const bottomPadding = options.bottomPadding || 70;
  const headerFill = options.headerFill || "#e2e8f0";
  const borderColor = options.borderColor || "#d1d5db";
  const contentWidth = options.contentWidth || doc.page.width - margin * 2;
  const totalTableHeight = headerHeight + rows.length * rowHeight + 12;

  ensureSpace(doc, totalTableHeight, bottomPadding);

  let currentY = doc.y;
  const columnX = [];
  let runningX = margin;
  columnWidths.forEach((width) => {
    columnX.push(runningX);
    runningX += width;
  });

  doc.roundedRect(margin, currentY, contentWidth, headerHeight, 3).fillAndStroke(headerFill, borderColor);
  doc.fillColor("#0f4c81").font("Helvetica-Bold").fontSize(9);
  headers.forEach((header, index) => {
    doc.text(header, columnX[index] + 8, currentY + 7, { width: columnWidths[index] - 10 });
  });

  currentY += headerHeight;
  doc.fillColor("#374151").font("Helvetica").fontSize(9);

  rows.forEach((row, rowIndex) => {
    const requiredHeight = rowHeight + 4;
    if (currentY + requiredHeight > pageHeight - bottomPadding) {
      doc.addPage();
      doc.y = 50;
      currentY = doc.y;
      doc.roundedRect(margin, currentY, contentWidth, headerHeight, 3).fillAndStroke(headerFill, borderColor);
      doc.fillColor("#0f4c81").font("Helvetica-Bold").fontSize(9);
      headers.forEach((header, index) => {
        doc.text(header, columnX[index] + 8, currentY + 7, { width: columnWidths[index] - 10 });
      });
      currentY += headerHeight;
      doc.fillColor("#374151").font("Helvetica").fontSize(9);
    }

    doc.roundedRect(margin, currentY, contentWidth, rowHeight, 2).fillAndStroke(rowIndex % 2 === 0 ? "#ffffff" : "#f9fafb", borderColor);
    row.forEach((cell, index) => {
      doc.text(String(cell), columnX[index] + 8, currentY + 6, { width: columnWidths[index] - 10 });
    });
    currentY += rowHeight;
  });

  doc.y = currentY + 10;
}

function writeFireSafetyAssessmentPdf(doc, report = {}) {
  const margin = 50;
  const contentWidth = doc.page.width - margin * 2;
  const reportData = report && typeof report === "object" ? report : {};
  const mlData = reportData.mlJson || reportData.mlData || reportData.mlPayload || reportData.rawData || {};
  const fallbackSource = { ...reportData, ...mlData };

  const projectName = getFieldValue(fallbackSource, ["projectName", "project_name"]) || "Unnamed Project";
  const clientId = getFieldValue(fallbackSource, ["clientId", "client_id", "client"]) || "N/A";
  const buildingType = getFieldValue(fallbackSource, ["buildingType", "building_type"]) || "Not specified";
  const complianceStandard = getFieldValue(fallbackSource, ["complianceStandard", "compliance_standard"]) || "Not specified";
  const complianceScore = getFieldValue(fallbackSource, ["complianceScore", "compliance_score"]) ?? "N/A";
  const rulesConfigured = normalizeArray(getFieldValue(fallbackSource, ["rulesConfigured", "rules_configured", "rules"]) || []);
  const equipmentRows = normalizeRecommendations(getFieldValue(fallbackSource, ["equipmentRecommendations", "equipment_recommendations", "recommendedEquipment", "derivedEquipment"]) || []);
  const reviewRows = normalizeFlags(getFieldValue(fallbackSource, ["reviewFlags", "review_flags"]) || []);
  const ruleReferences = normalizeRuleReferences(getFieldValue(fallbackSource, ["ruleReferences", "rule_refs", "rule_references"]) || []);
  const engineerRemarks = getFieldValue(fallbackSource, ["engineerRemarks", "engineer_remarks"]) || `Assessment prepared for ${projectName}. Review the proposed scope and code requirements before approval.`;
  const reportDate = getFieldValue(fallbackSource, ["reportDate", "report_date"]) || new Date().toISOString();
  const formattedDate = reportDate ? new Date(reportDate).toLocaleDateString() : "N/A";

  doc.font("Helvetica").fontSize(10).fillColor("#374151");
  doc.y = 50;

  doc.font("Helvetica-Bold").fontSize(18).fillColor("#111827").text("Fire Safety Planning Quotation System", { align: "left" });
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").fontSize(24).fillColor("#0f4c81").text("Fire Safety Assessment Report");
  doc.moveDown(1.2);

  const coverHeight = 170;
  ensureSpace(doc, coverHeight, 70);
  const coverTop = doc.y;
  doc.roundedRect(margin, coverTop, contentWidth, coverHeight, 8).fillAndStroke("#f8fafc", "#dbe3ea");
  doc.font("Helvetica-Bold").fontSize(13).fillColor("#0f4c81").text("Project Overview", margin + 18, coverTop + 16);
  doc.font("Helvetica-Bold").fontSize(15).fillColor("#111827").text(projectName, margin + 18, coverTop + 48, { width: contentWidth - 36 });
  doc.font("Helvetica").fontSize(11).fillColor("#374151");
  doc.text(`Client ID: ${clientId}`, margin + 18, coverTop + 80);
  doc.text(`Building Type: ${buildingType}`, margin + 18, coverTop + 102);
  doc.text(`Report Date: ${formattedDate}`, margin + 18, coverTop + 124);
  doc.text("Prepared from the latest assessment data and supporting recommendations.", margin + 18, coverTop + 146, { width: contentWidth - 36 });
  doc.y = coverTop + coverHeight + 18;

  ensureSpace(doc, 120, 70);
  const infoTop = doc.y;
  doc.roundedRect(margin, infoTop, contentWidth, 120, 8).fillAndStroke("#f9fbfd", "#dbe3ea");
  doc.font("Helvetica-Bold").fontSize(13).fillColor("#111827").text("Building Information", margin + 18, infoTop + 16);
  doc.font("Helvetica").fontSize(11).fillColor("#374151");
  doc.text(`Compliance Standard: ${complianceStandard}`, margin + 18, infoTop + 46);
  doc.text(`Rules Configured: ${rulesConfigured.length > 0 ? rulesConfigured.join(", ") : "Not specified"}`, margin + 18, infoTop + 68);
  doc.text(`Compliance Score: ${complianceScore}`, margin + 18, infoTop + 90);
  doc.y = infoTop + 130;

  drawFooter(doc, margin, contentWidth);

  if (equipmentRows.length > 0 || reviewRows.length > 0 || ruleReferences.length > 0 || engineerRemarks) {
    doc.addPage();
    doc.y = 50;
  }

  if (equipmentRows.length > 0) {
    ensureSpace(doc, 70, 70);
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#111827").text("Equipment Recommendations", margin, doc.y);
    doc.moveDown(0.7);
    drawTable(doc, ["Equipment", "Zone", "Quantity"], equipmentRows.map((row) => [row.name, row.zone, row.quantity]), [contentWidth * 0.6, contentWidth * 0.24, contentWidth * 0.16], {
      margin,
      contentWidth,
      bottomPadding: 90,
    });
  }

  if (reviewRows.length > 0) {
    ensureSpace(doc, 70, 70);
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#111827").text("Review Flags", margin, doc.y);
    doc.moveDown(0.7);
    drawTable(doc, ["Severity", "Reason"], reviewRows.map((row) => [row.severity, row.reason]), [contentWidth * 0.22, contentWidth * 0.78], {
      margin,
      contentWidth,
      bottomPadding: 90,
    });
  } else {
    ensureSpace(doc, 70, 70);
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#111827").text("Review Flags", margin, doc.y);
    doc.moveDown(0.7);
    doc.font("Helvetica").fontSize(10).fillColor("#374151").text("No review flags detected.", margin, doc.y);
  }

  if (ruleReferences.length > 0) {
    ensureSpace(doc, 70, 70);
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#111827").text("Rule References", margin, doc.y);
    doc.moveDown(0.7);

    const groupedRuleReferences = new Map();
    ruleReferences.forEach((rule) => {
      const equipmentName = rule.equipment || "General";
      if (!groupedRuleReferences.has(equipmentName)) {
        groupedRuleReferences.set(equipmentName, []);
      }
      groupedRuleReferences.get(equipmentName).push(rule);
    });

    groupedRuleReferences.forEach((rules, equipmentName) => {
      ensureSpace(doc, 24, 90);
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#111827").text(equipmentName, margin + 8, doc.y);
      doc.moveDown(0.4);
      rules.forEach((rule) => {
        ensureSpace(doc, 14, 90);
        doc.font("Helvetica").fontSize(9).fillColor("#374151").text(`- ${rule.code || rule.reference || "Reference"}`, margin + 16, doc.y);
        doc.moveDown(0.25);
      });
    });
  }

  if (engineerRemarks) {
    ensureSpace(doc, 100, 70);
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#111827").text("Engineer Remarks", margin, doc.y);
    doc.moveDown(0.7);
    const remarksHeight = 90;
    ensureSpace(doc, remarksHeight, 70);
    const remarksTop = doc.y;
    doc.roundedRect(margin, remarksTop, contentWidth, remarksHeight, 6).fillAndStroke("#ffffff", "#dbe3ea");
    doc.font("Helvetica").fontSize(10).fillColor("#374151").text(engineerRemarks, margin + 12, remarksTop + 14, { width: contentWidth - 24, align: "left" });
    doc.y = remarksTop + remarksHeight + 10;
  }

  drawFooter(doc, margin, contentWidth);
}

module.exports = {
  buildQuotationBreakdownRows,
  parseBreakdownFromDescription,
  writeQuotationPdf,
  writeFireSafetyAssessmentPdf,
};