# Mock Data Server

This directory contains a mock data server implementation using json-server to simulate API endpoints for development.

## Structure

The mock data is organized into domain-specific JSON files under the `data/` directory:

```
data/
├── systems.json              # Basic system information
└── authorization/
    ├── risks.json           # Authorization risks and non-compliant controls
    └── packages.json        # Authorization packages and decisions
```

Each JSON file represents a specific domain or feature area, making it easier to maintain and update the mock data.

## Running the Mock Server

1. Generate the combined database:
```bash
npm run generate-db
```
This will combine all JSON files into a single `db.json` file.

2. Start the mock server:
```bash
npm run mock-server
```
This will start json-server on port 3001.

3. Or do both in one command:
```bash
npm run mock
```

## Available Endpoints

The mock server provides the following REST endpoints:

### Systems
- GET    /systems
- GET    /systems/:id
- POST   /systems
- PUT    /systems/:id
- DELETE /systems/:id

### Authorization
- GET    /authorizationRisks
- GET    /nonCompliantControls
- GET    /authorizationPackages
- GET    /authorizationDecisions

### Reference Data
- GET    /enums
- GET    /commonPorts

## Adding New Mock Data

1. Create a new JSON file in the appropriate subdirectory under `data/`
2. Add your mock data following the existing structure
3. Run `npm run generate-db` to update the combined database

## Development Notes

- The mock server automatically adds REST endpoints for each top-level array in the JSON files
- All changes to db.json will be watched and automatically reloaded
- The server supports standard REST operations (GET, POST, PUT, DELETE)
- Relationships can be created using resource IDs (e.g., systemId)