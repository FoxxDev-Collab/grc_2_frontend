# System Dashboard Simplification Plan

## Current State
The SystemDashboard component currently displays a complex ATO (Authority to Operate) process tracking interface with:
- System overview information
- Multi-step progress tracking
- Phase details and sub-steps
- Progress indicators and status chips

## Proposed Changes

### 1. Component Simplification
Remove all existing ATO-related content and replace with:
- A welcoming header section
- A clean, organized list of clients

### 2. Data Requirements
- Client list from clientApi.getClients()
  - Returns array of client objects with properties like:
    - id
    - name
    - industry
    - status
    - complianceScore

### 3. Implementation Details

#### Component Structure
```jsx
const SystemDashboard = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch clients on component mount
  useEffect(() => {
    loadClients();
  }, []);

  // Display greeting and client list
  return (
    <Container>
      <Greeting />
      <ClientList clients={clients} />
    </Container>
  );
};
```

#### Key Features
1. Greeting Section
   - Welcoming message
   - Current date/time display
   - Clean, modern styling

2. Client List Section
   - Organized grid/list of client cards
   - Each card shows:
     - Client name
     - Industry
     - Status indicator
   - Click handling for navigation

### 4. Technical Considerations
- Use Material-UI components for consistent styling
- Implement proper loading states
- Handle error cases gracefully
- Ensure responsive design

## Implementation Steps
1. Remove existing ATO-related code
2. Implement new simplified structure
3. Add client data fetching
4. Style the new components
5. Add loading and error states
6. Test functionality

## Next Steps
1. Review this plan
2. Switch to Code mode for implementation
3. Test the new dashboard
4. Deploy changes

Would you like to proceed with this plan or would you like to make any adjustments?