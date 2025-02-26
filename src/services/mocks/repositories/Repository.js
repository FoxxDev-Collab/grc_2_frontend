// src/services/mocks/repositories/Repository.js
import mockDb, { generateId, delay } from '../mockDb';
import { ApiError } from '../../utils/apiHelpers';

export class Repository {
  constructor(entityName) {
    this.entityName = entityName;
    this.collection = mockDb[entityName] || [];
  }

  // Find all entities with optional filtering
  async findAll(queryParams = {}) {
    await delay();
    
    let results = [...this.collection];
    
    // Apply filters from queryParams
    Object.entries(queryParams).forEach(([key, value]) => {
      if (key === 'sort' || key === 'order' || key === 'limit' || key === 'offset') {
        return; // Skip special params
      }
      
      results = results.filter(item => {
        if (typeof value === 'string' && value.includes(',')) {
          // Handle array values (e.g., status=open,closed)
          const values = value.split(',');
          return values.includes(String(item[key]));
        }
        return String(item[key]) === String(value);
      });
    });
    
    // Apply sorting
    if (queryParams.sort) {
      const sortField = queryParams.sort;
      const sortOrder = queryParams.order === 'desc' ? -1 : 1;
      
      results.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * sortOrder;
        if (a[sortField] > b[sortField]) return 1 * sortOrder;
        return 0;
      });
    }
    
    // Apply pagination
    if (queryParams.limit) {
      const limit = parseInt(queryParams.limit, 10);
      const offset = parseInt(queryParams.offset, 10) || 0;
      
      results = results.slice(offset, offset + limit);
    }
    
    return results;
  }

  // Find entity by ID
  async findById(id) {
    await delay();
    
    const entity = this.collection.find(item => String(item.id) === String(id));
    
    if (!entity) {
      throw new ApiError(`${this.entityName} not found with id: ${id}`, 404);
    }
    
    return entity;
  }

  // Create new entity
  async create(data) {
    await delay();
    
    const newEntity = {
      id: data.id || generateId(this.entityName.slice(0, 3) + '-'),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.collection.push(newEntity);
    mockDb[this.entityName] = this.collection;
    
    return newEntity;
  }

  // Update entity
  async update(id, data) {
    await delay();
    
    const index = this.collection.findIndex(item => String(item.id) === String(id));
    
    if (index === -1) {
      throw new ApiError(`${this.entityName} not found with id: ${id}`, 404);
    }
    
    const updatedEntity = {
      ...this.collection[index],
      ...data,
      id: this.collection[index].id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    this.collection[index] = updatedEntity;
    mockDb[this.entityName] = this.collection;
    
    return updatedEntity;
  }

  // Partial update entity
  async partialUpdate(id, data) {
    return this.update(id, data);
  }

  // Delete entity
  async delete(id) {
    await delay();
    
    const index = this.collection.findIndex(item => String(item.id) === String(id));
    
    if (index === -1) {
      throw new ApiError(`${this.entityName} not found with id: ${id}`, 404);
    }
    
    this.collection.splice(index, 1);
    mockDb[this.entityName] = this.collection;
    
    return { success: true, message: `${this.entityName} deleted successfully` };
  }
}

// Factory function to get repository instance
export const getRepository = (entityName) => {
  if (!mockDb[entityName]) {
    mockDb[entityName] = [];
  }
  
  return new Repository(entityName);
};