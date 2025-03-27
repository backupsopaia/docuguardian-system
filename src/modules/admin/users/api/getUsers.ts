
import { supabase, fromTable } from '@/integrations/supabase/client';
import { User, GetUsersResponse } from './types';
import { createTimeoutPromise, mapDbUserToFrontend, createMockUserData } from './userServiceUtils';

// Get all users with optimized error handling
export const getUsers = async (): Promise<User[]> => {
  try {
    // Use Promise.race to either get data or timeout
    const fetchPromise = fromTable('users').select('*');
    const timeoutPromise = createTimeoutPromise<any>(10000, 'Request timed out after 10 seconds');
    
    const result = await Promise.race([fetchPromise, timeoutPromise]);
    
    // Destructure after checking result is valid
    const { data, error } = result || { data: null, error: new Error('Invalid response') };
    
    if (error) {
      console.error('Error fetching users:', error);
      // Log the error for debugging purposes
      console.log('Supabase error details:', JSON.stringify(error));
      // Return mock data in a non-blocking way
      return Promise.resolve(createMockUserData());
    }
    
    // Handle null or undefined data
    if (!data) {
      console.error('No data returned from API');
      return [];
    }
    
    // Ensure data is an array before mapping
    if (!Array.isArray(data)) {
      console.error('Expected array but got:', typeof data);
      return [];
    }
    
    // Process data in a non-blocking way using a small delay
    return new Promise(resolve => {
      setTimeout(() => {
        const mappedData = data.map(user => mapDbUserToFrontend(user));
        // Log the fetched users for debugging
        console.log(`Fetched ${mappedData.length} users from database`);
        resolve(mappedData);
      }, 0);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    // Log the error for debugging purposes
    console.log('Unexpected error details:', error instanceof Error ? error.message : String(error));
    // Return mock data in a non-blocking way
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(createMockUserData());
      }, 0);
    });
  }
};
