# Mock Data Conversion Plan

## Current State Analysis
- Mock data is currently in JavaScript files with exported constants
- Data is well-structured but needs to be converted to pure JSON
- Multiple related data sets exist within single files (e.g., clients, departments, documents)
- Some data has clear relationships (e.g., departments and documents reference clientId)

## Data Organization Plan

### 1. Primary Data Structures
We will organize the data into these main categories in db.json:

```json
{
  "clients": [],
  "departments": [],
  "documents": [],
  "keyPersonnel": [],
  "assessments": {
    "plans": [],
    "scanResults": [],
    "controls": [],
    "documents": []
  },
  "lookups": {
    "industries": [],
    "clientSizes": [],
    "clientStatuses": [],
    "documentCategories": [],
    "documentTypes": []
  }
}
```

### 2. Data Relationships
- Maintain existing relationships through foreign keys (e.g., clientId)
- Ensure consistent ID formats across all data types
- Preserve all existing data fields and their types

### 3. Implementation Steps

1. **Create Base Structure**
   - Set up initial db.json with main categories
   - Ensure proper JSON formatting
   - Validate schema structure

2. **Convert Mock Data**
   - Transform JavaScript objects to JSON format
   - Remove any JavaScript-specific syntax
   - Ensure all dates are in ISO format
   - Validate data integrity

3. **Client Data Migration**
   - Convert mockClients array to clients collection
   - Transform nested objects (e.g., address) to proper JSON
   - Ensure all required fields are present

4. **Department Data Migration**
   - Convert mockDepartments to departments collection
   - Maintain clientId relationships
   - Ensure arrays (e.g., positions) are properly formatted

5. **Document Data Migration**
   - Convert mockDocuments to documents collection
   - Maintain proper file size representations
   - Preserve category and type relationships

6. **Assessment Data Migration**
   - Structure assessment plans, scan results, and controls
   - Maintain proper date formats
   - Preserve all status and relationship information

7. **Lookup Data Migration**
   - Convert all lookup arrays to proper JSON format
   - Organize under lookups object
   - Maintain data integrity

### 4. Validation Steps

1. **Data Integrity Checks**
   - Verify all required fields are present
   - Ensure proper data types
   - Validate date formats
   - Check for missing or null values

2. **Relationship Validation**
   - Verify all foreign key relationships
   - Check for orphaned records
   - Validate lookup references

3. **API Endpoint Testing**
   - Test each endpoint with new JSON structure
   - Verify proper data retrieval
   - Validate filtering and sorting capabilities

### 5. Success Criteria

1. All mock data successfully converted to JSON format
2. Data relationships maintained and validated
3. No JavaScript-specific syntax remaining
4. All dates in ISO format
5. JSON server successfully serves all endpoints
6. API calls return expected data structure
7. Existing frontend components work with new data structure

### 6. Rollback Plan

1. Keep backup of original mock data files
2. Version control db.json changes
3. Maintain ability to switch between mock and JSON server implementations

## Next Steps

1. Review this plan with the team
2. Create initial db.json structure
3. Begin systematic data conversion
4. Implement validation checks
5. Test with existing frontend components
6. Document any API changes or updates