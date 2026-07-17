# API Documentation (Swagger-style)

This document describes the backend APIs for the Fire Safety Planning Quotation System.

Base URL:
- Local: http://localhost:5000

## Overview

The API exposes endpoints for:
- managing equipment catalog entries
- creating quotation previews and persisted quotations
- generating quotation and report PDFs
- uploading plan files
- processing ML-driven safety assessment results

All responses use a consistent JSON structure:

```json
{
  "success": true,
  "data": {}
}
```

Error responses look like:

```json
{
  "success": false,
  "message": "Explanation of the error"
}
```

---

## 1. Health Check

### GET /
Checks whether the API server is running.

Request:
```http
GET /
```

Response:
```json
{
  "success": true,
  "message": "Fire Safety Backend API is running"
}
```

---

## 2. Equipment API

### GET /api/equipment
Returns all equipment entries sorted by ID.

Response example:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Smoke Detector",
      "type": "Detection",
      "price": 1200,
      "quantity": 10,
      "createdAt": "2026-07-01T10:00:00.000Z"
    }
  ]
}
```

### POST /api/equipment
Creates a new equipment catalog item.

Request body:
```json
{
  "name": "Smoke Detector",
  "type": "Detection",
  "price": 1200,
  "quantity": 10
}
```

Required fields:
- name: string
- type: string
- price: positive number
- quantity: non-negative number

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Smoke Detector",
    "type": "Detection",
    "price": 1200,
    "quantity": 10
  }
}
```

---

## 3. Quotation API

### POST /api/quotations/calculate
Calculates a quotation preview without storing it in the database.

Request body:
```json
{
  "projectName": "Office Building A",
  "items": [
    { "equipmentId": 1, "quantity": 2 },
    { "equipmentId": 2, "quantity": 1 }
  ]
}
```

Response example:
```json
{
  "success": true,
  "data": {
    "projectName": "Office Building A",
    "equipmentCost": 5000,
    "installationCost": 500,
    "maintenanceCost": 250,
    "gst": 1040,
    "totalCost": 6790,
    "breakdown": []
  }
}
```

### POST /api/quotations
Creates a quotation and also creates a related report entry.

Request body:
```json
{
  "projectName": "Office Building A",
  "items": [
    { "equipmentId": 1, "quantity": 2 },
    { "equipmentId": 2, "quantity": 1 }
  ]
}
```

Response example:
```json
{
  "success": true,
  "data": {
    "quotation": {
      "id": 1,
      "projectName": "Office Building A",
      "equipmentCost": 5000,
      "installationCost": 500,
      "maintenanceCost": 250,
      "gst": 1040,
      "totalCost": 6790
    },
    "report": {
      "id": 1,
      "reportName": "Quotation Report - Office Building A"
    },
    "breakdown": []
  }
}
```

### GET /api/quotations
Returns all quotations sorted newest first.

### GET /api/quotations/:id
Returns a single quotation by ID.

### GET /api/quotations/:id/pdf
Downloads a PDF for a quotation.

---

## 4. Report API

### GET /api/reports
Returns all reports sorted newest first.

### POST /api/reports
Creates a standalone report entry.

Request body:
```json
{
  "reportName": "Safety Assessment",
  "description": "Assessment summary",
  "quotationId": 1
}
```

### GET /api/reports/:id/pdf
Downloads a PDF for a report.

---

## 5. Uploaded Plan API

### GET /api/uploaded-plans
Returns all uploaded plan records.

### POST /api/uploaded-plans
Uploads a plan file and stores metadata in the database.

Request format:
- multipart/form-data
- field name: planFile
- optional body fields: fileName, quotationId

Example with curl:
```bash
curl -X POST http://localhost:5000/api/uploaded-plans \
  -F "planFile=@/path/to/plan.pdf" \
  -F "fileName=plan.pdf" \
  -F "quotationId=1"
```

Response example:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fileName": "1712345678901-123456789.pdf",
    "quotationId": 1,
    "uploadedAt": "2026-07-01T10:00:00.000Z",
    "uploadedFile": {
      "originalName": "plan.pdf",
      "storedName": "1712345678901-123456789.pdf",
      "size": 245678,
      "path": "uploads/1712345678901-123456789.pdf"
    }
  }
}
```

---

## 6. ML Processing API

### POST /api/ml/process-result
Processes ML-derived assessment output and creates a quotation and report.

Request body:
```json
{
  "projectName": "Warehouse A",
  "recommendedEquipment": ["sprinkler", "extinguisher"],
  "detections": [],
  "equipment_recommendations": [
    {
      "name": "Sprinkler System",
      "quantity": 3
    }
  ],
  "review_flags": [],
  "rule_refs": [],
  "client_id": 42,
  "building_type": "warehouse",
  "compliance_standard": "NFPA",
  "compliance_score": 92,
  "reportDate": "2026-07-17T12:00:00.000Z",
  "engineerRemarks": "Proceed with standard compliance review."
}
```

Response example:
```json
{
  "success": true,
  "data": {
    "projectName": "Warehouse A",
    "normalizedItems": [],
    "derivedEquipment": [],
    "quotation": {
      "id": 3,
      "projectName": "Warehouse A"
    },
    "report": {
      "id": 2,
      "reportName": "Quotation Report - Warehouse A"
    },
    "breakdown": []
  }
}
```

---

## 7. Notes for Teammates

- Most endpoints return a top-level success flag.
- Validation errors return HTTP 400 with a descriptive message.
- Missing records return HTTP 404.
- PDF endpoints return a binary PDF file rather than JSON.
- Uploaded files are stored in the uploads directory.

## 8. Suggested Testing Flow

1. Start the server:
```bash
npm start
```

2. Check the health endpoint:
```bash
curl http://localhost:5000/
```

3. Seed equipment via POST /api/equipment.

4. Create a quotation via POST /api/quotations.

5. Download the generated PDF via /api/quotations/:id/pdf.
