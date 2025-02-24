# GRC User Data Conversion Plan

## Overview
Convert GRC user mock data to support authentication and authorization via json-server, focusing on maintaining role-based access control while providing a secure mock authentication flow.

## Data Structure Design

### 1. Users Collection
Primary user data will be stored in `users` collection:

```json
{
  "users": [
    {
      "id": 1,
      "email": "senior.ao@example.com",
      "password": "password123",  // Note: In production, this would be hashed
      "firstName": "John",
      "lastName": "Smith",
      "role": "SENIOR_AO",
      "isActive": true,
      "lastActive": "2024-02-19T12:00:00Z"
    }
  ]
}
```

### 2. Roles and Permissions
Store role definitions and permissions in a separate structure:

```json
{
  "roles": {
    "SENIOR_AO": {
      "name": "Senior Authorizing Official",
      "permissions": ["all"]
    },
    "SUBORDINATE_AO": {
      "name": "Subordinate Authorizing Official",
      "permissions": ["view", "edit", "approve"]
    },
    "AODR": {
      "name": "Authorizing Official Designated Representative",
      "permissions": ["view", "edit", "review"]
    },
    "SCA": {
      "name": "Security Control Assessor",
      "permissions": ["view", "assess", "review"]
    },
    "SCAR": {
      "name": "Security Control Assessor Representative",
      "permissions": ["view", "assess"]
    }
  }
}
```

## Implementation Steps

1. Create directory structure:
```
src/services/mocks/data/
├── auth/
│   ├── users.json
│   └── roles.json
```

2. Convert user data:
   - Create users.json with all GRC users
   - Remove direct permission arrays from user objects
   - Keep role references to maintain relationships
   - Ensure all required fields are present

3. Create roles data:
   - Extract role definitions into roles.json
   - Include full permission mappings
   - Add descriptive names for each role
   - Document permission scopes

## JSON Files Creation

### users.json
```json
{
  "users": [
    {
      "id": 1,
      "email": "senior.ao@example.com",
      "password": "password123",
      "firstName": "John",
      "lastName": "Smith",
      "role": "SENIOR_AO",
      "isActive": true,
      "lastActive": "2024-02-19T12:00:00Z"
    },
    {
      "id": 2,
      "email": "sao@example.com",
      "password": "password123",
      "firstName": "Jane",
      "lastName": "Doe",
      "role": "SUBORDINATE_AO",
      "isActive": true,
      "lastActive": "2024-02-19T12:00:00Z"
    }
  ]
}
```

### roles.json
```json
{
  "roles": {
    "SENIOR_AO": {
      "name": "Senior Authorizing Official",
      "description": "Top-level authorization authority",
      "permissions": ["all"]
    },
    "SUBORDINATE_AO": {
      "name": "Subordinate Authorizing Official",
      "description": "Secondary authorization authority",
      "permissions": ["view", "edit", "approve"]
    },
    "AODR": {
      "name": "Authorizing Official Designated Representative",
      "description": "Acts on behalf of authorizing officials",
      "permissions": ["view", "edit", "review"]
    },
    "SCA": {
      "name": "Security Control Assessor",
      "description": "Performs security control assessments",
      "permissions": ["view", "assess", "review"]
    },
    "SCAR": {
      "name": "Security Control Assessor Representative",
      "description": "Assists in security control assessments",
      "permissions": ["view", "assess"]
    }
  }
}
```

## API Endpoints to Support

The json-server will automatically create these endpoints:

1. GET /users - List all users
2. GET /users/:id - Get specific user
3. GET /roles - Get role definitions
4. POST /users - Create new user
5. PUT /users/:id - Update user
6. DELETE /users/:id - Delete user

For login functionality, we'll need to implement a custom route in json-server that:
1. Accepts email and password
2. Returns user data with role and token
3. Handles basic authentication errors

## Implementation Order

1. Create the directory structure
2. Create roles.json first (as it's referenced by users)
3. Create users.json with role references
4. Test the JSON structure with generateDb.js
5. Verify the combined db.json has the correct structure
6. Test API endpoints for basic CRUD operations
7. Implement login functionality in the frontend to work with the new structure

## Success Criteria

1. All user data successfully converted to JSON
2. Role and permission relationships maintained
3. JSON files properly combined by generateDb.js
4. Frontend login flow works with new data structure
5. Role-based access control functions as expected

## Security Notes

1. This is a mock implementation - passwords are stored in plain text
2. In production:
   - Passwords would be hashed
   - Additional security measures would be implemented
   - Token-based authentication would be used
   - Proper session management would be implemented

## Next Steps

1. Create the directory structure
2. Implement the JSON files
3. Test with generateDb.js
4. Update frontend authentication logic
5. Test the complete login flow