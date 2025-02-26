import { useState, useEffect } from 'react';
import { clientApi } from '../../services';

export const useCompanyStructure = (clientId) => {
  const [client, setClient] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCompanyStructure = async () => {
      try {
        setLoading(true);
        const [clientData, deptData, docsData] = await Promise.all([
          clientApi.getClient(Number(clientId)),
          clientApi.getDepartments(clientId),
          clientApi.getCompanyDocuments(clientId)
        ]);
        setClient(clientData);
        setDepartments(deptData);
        setDocuments(docsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyStructure();
  }, [clientId]);

  const updateClient = async (updates) => {
    try {
      const updatedClient = await clientApi.updateClient(Number(clientId), updates);
      setClient(updatedClient);
      setError(null);
      return updatedClient;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateDepartment = async (deptId, departmentData) => {
    try {
      const updatedDept = await clientApi.updateDepartment(clientId, deptId, departmentData);
      setDepartments(prev =>
        prev.map(dept => dept.id === deptId ? updatedDept : dept)
      );
      setError(null);
      return updatedDept;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const createDepartment = async (departmentData) => {
    try {
      const newDept = await clientApi.createDepartment(clientId, {
        ...departmentData,
        employeeCount: 0,
        positions: []
      });
      setDepartments(prev => [...prev, newDept]);
      setError(null);
      return newDept;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addPosition = async (deptId) => {
    try {
      const department = departments.find(d => d.id === deptId);
      if (!department) {
        throw new Error('Department not found');
      }

      const position = {
        id: (department.positions?.length || 0) + 1,
        name: 'New Position',
        holder: 'Unassigned'
      };

      const updatedPositions = [...(department.positions || []), position];
      
      return await updateDepartment(deptId, {
        ...department,
        positions: updatedPositions
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const uploadDocument = async (file) => {
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      const newDoc = await clientApi.uploadDocument(clientId, formData);
      setDocuments(prev => [...prev, newDoc]);
      setError(null);
      return newDoc;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const downloadDocument = async (docId) => {
    try {
      await clientApi.downloadDocument(clientId, docId);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    client,
    departments,
    documents,
    loading,
    error,
    setError,
    updateClient,
    createDepartment,
    updateDepartment,
    addPosition,
    uploadDocument,
    downloadDocument
  };
};