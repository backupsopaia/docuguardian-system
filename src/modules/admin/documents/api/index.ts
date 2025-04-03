
// Exportando os serviços para facilitar o uso em outros módulos
export * from './types';
export * from './baseService';
export * from './documentStatusService';
export * from './utils';

// Re-exportando os dados mock para uso em testes
export { MOCK_DOCUMENTS } from './mockData';
