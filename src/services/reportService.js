function formatCurrency(value) {
  return `₹${Number(value ?? 0).toFixed(2)}`;
}

function buildReportDescription(quotation) {
  const summaryLines = [
    `Fire Safety Analysis Report`,
    `Project Name: ${quotation.projectName}`,
    `Generated From: Quotation ${quotation.id}`,
    "",
    "1. Overview",
    `- The project requires a complete fire safety cost evaluation for ${quotation.projectName}.`,
    "- The quotation includes equipment, installation, maintenance, and applicable tax charges.",
    "",
    "2. Cost Summary",
    `- Equipment Cost: ${quotation.equipmentCost}`,
    `- Installation Cost: ${quotation.installationCost}`,
    `- Maintenance Cost: ${quotation.maintenanceCost}`,
    `- GST: ${quotation.gst}`,
    `- Total Cost: ${quotation.totalCost}`,
  ];

  if (Array.isArray(quotation.breakdown) && quotation.breakdown.length > 0) {
    summaryLines.push("", "3. Itemized Equipment Cost");
    quotation.breakdown.forEach((item) => {
      summaryLines.push(
        `- ${item.name} | Qty: ${item.quantity} | Unit Price: ${formatCurrency(item.unitPrice)} | Total: ${formatCurrency(item.itemTotal)}`
      );
    });
  }

  summaryLines.push(
    "",
    "4. Recommended Actions",
    "- Review the equipment list and confirm required safety coverage.",
    "- Ensure all proposed installations meet local fire safety standards.",
    "- Verify maintenance and inspection planning before final approval."
  );

  return summaryLines.join("\n");
}

module.exports = {
  buildReportDescription,
};
