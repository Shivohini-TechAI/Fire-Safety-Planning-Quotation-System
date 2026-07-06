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
    "",
    "3. Recommended Actions",
    "- Review the equipment list and confirm required safety coverage.",
    "- Ensure all proposed installations meet local fire safety standards.",
    "- Verify maintenance and inspection planning before final approval.",
  ];

  return summaryLines.join("\n");
}

module.exports = {
  buildReportDescription,
};
