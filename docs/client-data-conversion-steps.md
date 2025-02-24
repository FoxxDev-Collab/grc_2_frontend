# Client Data Conversion Implementation Steps

## Overview
We need to convert the client-related mock data from JavaScript files into JSON files that can be processed by our existing generateDb.js script. The script looks for .json files in the src/services/mocks/data directory and its subdirectories.

## Directory Structure
Create the following directory structure for client-related JSON files:
```
src/services/mocks/data/
├── clients/
│   ├── clients.json
│   ├── departments.json
│   ├── documents.json
│   └── personnel.json
└── lookups/
    └── client_lookups.json
```

## Data Conversion Steps

### 1. Create Client Data Files

#### clients.json
Convert mockClients array to:
```json
{
  "clients": [
    {
      "id": 1,
      "name": "Acme Corporation",
      "industry": "Technology",
      "email": "contact@acme.com",
      "phone": "(555) 123-4567",
      "primaryContact": "John Smith",
      "createdAt": "2024-01-01T10:00:00Z",
      "lastActivity": "2024-02-19T10:00:00Z",
      "complianceScore": 85,
      "status": "active",
      "address": {
        "street": "123 Tech Lane",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94105",
        "country": "USA"
      },
      "size": "Enterprise",
      "employeeCount": 5000,
      "website": "www.acme.com"
    }
  ]
}
```

#### departments.json
Convert mockDepartments array to:
```json
{
  "departments": [
    {
      "id": 1,
      "clientId": 1,
      "name": "Information Technology",
      "head": "David Wilson",
      "headTitle": "CTO",
      "employeeCount": 150,
      "positions": ["Software Engineer", "System Administrator", "Security Analyst"],
      "lastUpdated": "2024-02-19T10:00:00Z"
    }
  ]
}
```

#### documents.json
Convert mockDocuments array to:
```json
{
  "clientDocuments": [
    {
      "id": 1,
      "clientId": 1,
      "name": "Security Policy.pdf",
      "type": "PDF",
      "lastUpdated": "2024-02-19T10:00:00Z",
      "category": "Policies",
      "size": 2500000,
      "uploadedBy": "John Smith"
    }
  ]
}
```

#### personnel.json
Convert mockKeyPersonnel array to:
```json
{
  "keyPersonnel": [
    {
      "id": 1,
      "clientId": 1,
      "name": "John Smith",
      "role": "Primary Contact",
      "department": "Executive",
      "title": "CEO"
    }
  ]
}
```

### 2. Create Lookup Data File

#### client_lookups.json
Combine all lookup arrays into:
```json
{
  "clientLookups": {
    "industries": [
      "Technology",
      "Healthcare",
      "Financial Services",
      "Manufacturing",
      "Retail",
      "Energy",
      "Education",
      "Government",
      "Non-Profit"
    ],
    "sizes": [
      "Small",
      "Medium",
      "Large",
      "Enterprise"
    ],
    "statuses": [
      "active",
      "inactive",
      "suspended",
      "pending"
    ],
    "documentCategories": [
      "Policies",
      "Procedures",
      "Compliance",
      "Reports",
      "Training",
      "Documentation",
      "General"
    ],
    "documentTypes": [
      "PDF",
      "DOCX",
      "XLSX",
      "PPT",
      "TXT",
      "ZIP"
    ]
  }
}
```

## Implementation Order

1. Create directory structure
   ```powershell
   New-Item -ItemType Directory -Path "src/services/mocks/data/clients"
   New-Item -ItemType Directory -Path "src/services/mocks/data/lookups"
   ```

2. Create JSON files in order:
   - client_lookups.json (simplest, no dependencies)
   - clients.json (base data)
   - departments.json (depends on clients)
   - documents.json (depends on clients)
   - personnel.json (depends on clients and departments)

3. Validate each file:
   - Ensure valid JSON format
   - Check all required fields are present
   - Verify relationships (clientId references)
   - Confirm date formats are consistent

4. Test with generateDb.js:
   - Run the script
   - Verify db.json contains all new data
   - Check data structure matches expected format

5. Update API endpoints:
   - Test existing endpoints with new data structure
   - Verify frontend components still work

## Success Criteria

1. All JSON files are properly formatted and valid
2. generateDb.js successfully combines all files
3. Data relationships are maintained
4. Frontend components work with new data structure
5. No JavaScript-specific syntax remains in the data

## Rollback Plan

1. Keep backup of original mock data files
2. Version control all new JSON files
3. Maintain ability to revert to original mock data if needed