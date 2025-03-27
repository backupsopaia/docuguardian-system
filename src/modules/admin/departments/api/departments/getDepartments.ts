
import { Department } from '@/modules/admin/users/data/departments';
import { apiFetch } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';

// Get all departments
export const getDepartments = async (): Promise<Department[]> => {
  try {
    console.log('Fetching departments from Supabase...');
    // Try to fetch departments from Supabase directly
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Supabase error fetching departments:', error);
      throw error;
    }
    
    // If we have data from Supabase, ensure it's an array and return it
    if (data && Array.isArray(data)) {
      console.log(`Successfully fetched ${data.length} departments from Supabase`);
      // Map database column names to frontend property names
      return data.map(dept => ({
        id: dept.id,
        name: dept.name,
        description: dept.description || '',
        isActive: dept.is_active || false,
        userCount: dept.user_count || 0,
        createdAt: dept.created_at,
        updatedAt: dept.updated_at
      }));
    }
    
    // Fallback to API
    try {
      console.log('Falling back to API for departments...');
      const response = await apiFetch<Department[]>('/departments');
      if (Array.isArray(response)) {
        console.log(`Successfully fetched ${response.length} departments from API`);
        return response;
      } else {
        console.error('Expected array but got:', response);
        throw new Error('Invalid response format');
      }
    } catch (apiError) {
      console.error('API fetch failed:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Failed to fetch departments, using simulated data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would be an API call
    // For now, we import the mock data as fallback
    const { departments } = await import('@/modules/admin/users/data/departments');
    console.log(`Returned ${departments.length} simulated departments`);
    return Array.isArray(departments) ? departments : [];
  }
};

// Get department by ID
export const getDepartmentById = async (id: string): Promise<Department | undefined> => {
  try {
    // Try to fetch the department from Supabase directly
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // If we have data from Supabase, return it mapped to frontend format
    if (data) {
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        isActive: data.is_active || false,
        userCount: data.user_count || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    }
    
    // Fallback to API
    const response = await apiFetch<Department>(`/departments/${id}`);
    return response;
  } catch (error) {
    console.log('Failed to fetch department, using simulated data:', error);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Fallback to mock data
    const { departments } = await import('@/modules/admin/users/data/departments');
    return departments.find(dept => dept.id === id);
  }
};
