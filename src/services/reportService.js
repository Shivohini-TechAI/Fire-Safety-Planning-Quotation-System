function buildReportDescription(quotation) {
  return [
    `Project Name: ${quotation.projectName}`,
    `Equipment Cost: ${quotation.equipmentCost}`,
    `Installation Cost: ${quotation.installationCost}`,
    `Maintenance Cost: ${quotation.maintenanceCost}`,
    `GST: ${quotation.gst}`,
    `Total Cost: ${quotation.totalCost}`,
  ].join("\n");
}

module.exports = {
  buildReportDescription,
};
