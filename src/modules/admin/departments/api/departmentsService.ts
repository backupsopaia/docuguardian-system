
/**
 * Main departments service file
 * This file re-exports functionality from separate files for backward compatibility
 */

export { 
  getDepartments,
  getDepartmentById,
} from './departments/getDepartments';

export {
  createDepartment,
  updateDepartment,
  deleteDepartment
} from './departments/mutationDepartments';

export {
  assignDocumentToDepartment,
  getDocumentsByDepartment
} from './departments/departmentDocuments';
