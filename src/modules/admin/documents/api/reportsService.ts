
import { Document } from '@/components/admin/documents/DocumentsTable';
import { getDocuments } from './documentsService';

// Types for report params
export type ReportParams = {
  startDate?: string;
  endDate?: string;
  status?: string;
  category?: string;
  department?: string;
};

// Types for export request
export type ExportRequest = {
  format: 'pdf' | 'excel';
  data: any;
  filters: ReportParams;
};

// Get document reports
export const getDocumentReports = async (params: ReportParams) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Use the existing getDocuments function to get base data
  const documents = await getDocuments();
  
  // Filter documents based on params
  let filteredDocs = [...documents];
  
  if (params.status && params.status !== 'all') {
    filteredDocs = filteredDocs.filter(doc => doc.status === params.status);
  }
  
  if (params.category && params.category !== 'all') {
    filteredDocs = filteredDocs.filter(doc => doc.category === params.category);
  }
  
  if (params.department && params.department !== 'all') {
    filteredDocs = filteredDocs.filter(doc => doc.department === params.department);
  }
  
  if (params.startDate) {
    const startDate = new Date(params.startDate);
    filteredDocs = filteredDocs.filter(doc => new Date(doc.createdAt) >= startDate);
  }
  
  if (params.endDate) {
    const endDate = new Date(params.endDate);
    // Set time to end of day
    endDate.setHours(23, 59, 59, 999);
    filteredDocs = filteredDocs.filter(doc => new Date(doc.createdAt) <= endDate);
  }
  
  // Create summary data for charts
  const summary = {
    total: filteredDocs.length,
    byStatus: generateSummaryByField(filteredDocs, 'status'),
    byCategory: generateSummaryByField(filteredDocs, 'category'),
    byDepartment: generateSummaryByField(filteredDocs, 'department'),
  };
  
  // Return the report data
  return {
    summary,
    details: filteredDocs.map(doc => ({
      id: doc.id,
      name: doc.name,
      category: doc.category,
      status: doc.status,
      department: doc.department,
      createdAt: doc.createdAt,
      createdBy: doc.createdBy
    }))
  };
};

// Generate summary data for a specific field
const generateSummaryByField = (documents: Document[], field: keyof Document) => {
  const counts: Record<string, number> = {};
  const colors = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#22C55E', '#EAB308', '#6366F1'];
  
  // Count occurrences of each value
  documents.forEach(doc => {
    const value = doc[field] as string;
    counts[value] = (counts[value] || 0) + 1;
  });
  
  // Convert to array format for charts
  return Object.entries(counts).map(([name, value], index) => ({
    name,
    value,
    fill: colors[index % colors.length]
  }));
};

// Export report to PDF or Excel
export const exportReport = async (request: ExportRequest) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real application, this would call a backend API to generate
  // and return a download URL for the exported file
  
  console.log(`Exporting report to ${request.format}`, {
    filters: request.filters,
    documentCount: request.data.details.length
  });
  
  // Simulate successful export
  return {
    success: true,
    downloadUrl: `https://example.com/reports/download?id=${Math.random().toString(36).substring(2)}`
  };
};
