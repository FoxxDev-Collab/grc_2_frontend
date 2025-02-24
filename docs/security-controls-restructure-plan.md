# Security Controls Page Restructuring Plan

## Overview
This document outlines the plan for restructuring the Security Controls page to implement a more organized navigation system with dropdown menus and separate pages for different aspects of security control management.

## Current Structure
- Single Security Controls page with tabs for different control families
- All control-related functionality contained within one page
- Direct navigation to Security Controls from system layout

## Proposed Structure

### 1. Navigation Changes
Update SystemLayout to include dropdown menu for Security Controls with the following structure:

```
/systemId
  /Overview
  /ATO Process
  /Initial Assessment
  /System Categorization
  /Security Controls
    /Overview
    /Baseline Selection
    /Control Details
    /Implementation
  /Artifacts
  /Assessment
```

### 2. New Components Required

#### Security Controls Overview Page (`/security-controls`)
- High-level summary of security controls implementation
- Progress tracking
- Quick access to different sections

#### Baseline Selection Page (`/security-controls/baseline`)
- Selection interface for security control baseline
- Currently focusing on LOW baseline
- Justification documentation for selected baseline

#### Control Details Page (`/security-controls/details`)
- Moved from current tabbed interface
- Display NIST catalog components for LOW baseline
- Organized view of control families and their requirements

#### Implementation Page (`/security-controls/implementation`)
- Interface for marking control status:
  - Compliant
  - Non-Compliant
  - Not-Applicable
  - Pending Review
- Testing documentation (< 200 characters)
- Artifact mapping interface
- Should be able to continuously add testing documentation, table.

### 3. Technical Implementation Steps

1. Update SystemLayout Component
   - Modify navigationItems to include nested structure for Security Controls
   - Implement dropdown menu functionality
   - Update routing logic for nested paths

2. Create New Route Structure
   - Add new routes for each Security Controls section
   - Implement nested routing configuration
   - Set up proper navigation handling

3. Develop New Components
   - Create separate components for each new page
   - Implement shared components for common functionality
   - Ensure proper state management between components

4. Data Management
   - Update API integration for new structure
   - Implement proper data flow between components
   - Ensure consistent state management

5. Migration Plan
   - Move existing functionality to new components
   - Update references and dependencies
   - Implement proper data migration if needed

### 4. UI/UX Considerations

1. Navigation
   - Clear indication of current location
   - Easy access to all sections
   - Proper breadcrumb implementation

2. Component Design
   - Consistent styling across all pages
   - Clear visual hierarchy
   - Intuitive user interface

3. User Flow
   - Logical progression through sections
   - Clear relationship between different parts
   - Easy navigation between related sections

## Implementation Phases

### Phase 1: Navigation Structure
- Update SystemLayout with new navigation structure
- Implement basic routing for new pages
- Create placeholder components

### Phase 2: Core Components
- Develop Security Controls Overview page
- Implement Baseline Selection functionality
- Create Control Details view

### Phase 3: Implementation Features
- Build Implementation page
- Add status management functionality
- Implement artifact mapping

### Phase 4: Testing and Refinement
- Comprehensive testing of all features
- User feedback integration
- Performance optimization

## Technical Considerations

1. State Management
   - Proper handling of control status
   - Efficient data flow between components
   - Consistent state across navigation

2. Performance
   - Lazy loading for large control sets
   - Efficient rendering of control families
   - Optimized data fetching

3. Maintainability
   - Clear component structure
   - Reusable components
   - Well-documented code

## Next Steps

1. Review and approve plan
2. Create detailed technical specifications
3. Begin implementation with Phase 1
4. Regular progress reviews and adjustments