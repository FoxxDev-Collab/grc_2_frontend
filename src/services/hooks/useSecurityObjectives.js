// src/services/hooks/useSecurityObjectives.js
import { useState, useEffect, useCallback } from 'react';
import securityObjectivesService from '../business/SecurityObjectivesService';

export const useSecurityObjectives = (clientId) => {
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchObjectives = useCallback(async () => {
    try {
      setLoading(true);
      const data = await securityObjectivesService.getObjectives(clientId);
      setObjectives(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch objectives');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    if (clientId) {
      fetchObjectives();
    }
  }, [clientId, fetchObjectives]);

  const createObjective = async (objectiveData) => {
    try {
      const newObjective = await securityObjectivesService.createObjective(clientId, objectiveData);
      setObjectives(prev => [...prev, newObjective]);
      return newObjective;
    } catch (err) {
      setError(err.message || 'Failed to create objective');
      throw err;
    }
  };

  const updateObjective = async (objectiveId, updates) => {
    try {
      const updatedObjective = await securityObjectivesService.updateObjective(clientId, objectiveId, updates);
      setObjectives(prev => prev.map(obj => obj.id === objectiveId ? updatedObjective : obj));
      return updatedObjective;
    } catch (err) {
      setError(err.message || 'Failed to update objective');
      throw err;
    }
  };

  const deleteObjective = async (objectiveId) => {
    try {
      await securityObjectivesService.deleteObjective(clientId, objectiveId);
      setObjectives(prev => prev.filter(obj => obj.id !== objectiveId));
    } catch (err) {
      setError(err.message || 'Failed to delete objective');
      throw err;
    }
  };

  const getObjective = async (objectiveId) => {
    try {
      setLoading(true);
      const objective = await securityObjectivesService.getObjective(clientId, objectiveId);
      setError(null);
      return objective;
    } catch (err) {
      setError(err.message || 'Failed to fetch objective');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getObjectiveStatuses = async () => {
    try {
      return await securityObjectivesService.getObjectiveStatuses();
    } catch (err) {
      setError(err.message || 'Failed to fetch objective statuses');
      throw err;
    }
  };

  const getPriorityLevels = async () => {
    try {
      return await securityObjectivesService.getPriorityLevels();
    } catch (err) {
      setError(err.message || 'Failed to fetch priority levels');
      throw err;
    }
  };

  return {
    objectives,
    loading,
    error,
    fetchObjectives,
    createObjective,
    updateObjective,
    deleteObjective,
    getObjective,
    getObjectiveStatuses,
    getPriorityLevels
  };
};