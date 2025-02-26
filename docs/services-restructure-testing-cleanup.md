# Services Restructure Testing and Cleanup Strategy

## Testing Strategy

### 1. Test Page

We've created a dedicated test page at `/test/services` that demonstrates the new services implementation. This page includes:

- A test component that uses the new security objectives services
- Full CRUD operations to test the API services, business logic services, and React hooks
- Error handling and loading states

To test the new implementation:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:5173/test/services in your browser

3. Test the following operations:
   - View the list of security objectives
   - Create a new security objective
   - Update a security objective's status
   - Delete a security objective

### 2. Testing

Create unit tests for the new services:

- ensure the existing pages hook into the newly create API endpoints


### 3. Integration Testing

Test the integration between different layers:

1. API Services + Business Logic:
   - Ensure business logic correctly uses API services
   - Verify error handling and data transformation

2. Business Logic + React Hooks:
   - Ensure hooks correctly use business logic services
   - Verify state management and error handling

3. React Hooks + Components:
   - Ensure components correctly use hooks
   - Verify UI updates based on service responses

## Migration Strategy

### 1. Incremental Migration

Migrate one domain at a time:

1. Start with Security Objectives (already implemented)
2. Move to Security Initiatives
3. Continue with Risk Assessment
4. And so on...

For each domain:
1. Implement the API service
2. Implement the business logic service
3. Implement the React hook
4. Update components to use the new services
5. Test thoroughly

### 2. Component Updates

When updating components to use the new services:

1. Import the new hooks:
   ```jsx
   import { useSecurityObjectives } from '../../services/hooks/useSecurityObjectives';
   ```

2. Replace old service calls:
   ```jsx
   // Old approach
   const [objectives, setObjectives] = useState([]);
   useEffect(() => {
     securityObjectivesApi.getObjectives(clientId).then(setObjectives);
   }, [clientId]);

   // New approach
   const { objectives, loading, error } = useSecurityObjectives(clientId);
   ```

3. Update CRUD operations:
   ```jsx
   // Old approach
   const handleCreate = () => {
     securityObjectivesApi.createObjective(clientId, data).then(newObj => {
       setObjectives(prev => [...prev, newObj]);
     });
   };

   // New approach
   const { createObjective } = useSecurityObjectives(clientId);
   const handleCreate = () => {
     createObjective(data);
   };
   ```

## Cleanup Strategy

### 1. Deprecation Period

1. Mark old services as deprecated:
   ```jsx
   /**
    * @deprecated Use the new SecurityObjectivesApi from services/api/client/SecurityObjectivesApi instead
    */
   ```

2. Log warnings when old services are used:
   ```jsx
   console.warn('This service is deprecated. Use the new SecurityObjectivesApi instead.');
   ```

3. Set a deadline for migration (e.g., 2 weeks)

### 2. Dependency Tracking

1. Use a tool like `depcheck` to find unused dependencies:
   ```bash
   npx depcheck
   ```

2. Use `grep` to find references to old services:
   ```bash
   grep -r "import.*from.*services/client/securityObjectivesApi" src/
   ```

3. Track migration progress in a spreadsheet or task board

### 3. Final Cleanup

Once all components have been migrated:

1. Remove old service files:
   ```bash
   rm -rf src/services/client
   rm -rf src/services/system
   rm -rf src/services/grc_application
   ```

2. Remove old mock data files that are no longer needed

3. Update imports in any remaining files

4. Run tests to ensure everything still works

## Rollback Plan

In case of issues:

1. Keep the backup directory (`src/services_backup`) until the migration is complete

2. If a critical issue is found, revert to the old services:
   ```bash
   rm -rf src/services
   cp -r src/services_backup src/services
   ```

3. Update any modified components to use the old services again

## Monitoring and Validation

After the migration:

1. Monitor for errors in the console and error tracking system

2. Validate that all functionality works as expected

3. Check for performance improvements or regressions

4. Gather feedback from developers on the new structure