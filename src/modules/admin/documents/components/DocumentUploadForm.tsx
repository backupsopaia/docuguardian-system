
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, File, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { createDocument } from '../api/documentsApiService';
import { DocumentCategory, Client } from '../types/documents';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface DocumentUploadFormProps {
  categories: DocumentCategory[];
  clients: Client[];
  onUploadComplete: () => void;
  onCancel: () => void;
}

interface FileWithPreview extends File {
  preview?: string;
}

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  categories,
  clients,
  onUploadComplete,
  onCancel
}) => {
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [clientId, setClientId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Referência para o input de tag
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Configuração do dropzone para arquivos
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/zip': ['.zip'],
      'text/plain': ['.txt']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      // Reset states
      setUploadProgress(0);
      setUploadError(null);
      setUploadSuccess(false);
      
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        
        // If it's an image, generate preview
        if (file.type.startsWith('image/')) {
          const fileWithPreview = file as FileWithPreview;
          fileWithPreview.preview = URL.createObjectURL(file);
          setSelectedFile(fileWithPreview);
        } else {
          setSelectedFile(file);
        }
      }
    }
  });

  // Handler para adicionar tags
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim().toLowerCase())) {
      setTags([...tags, currentTag.trim().toLowerCase()]);
      setCurrentTag('');
      if (tagInputRef.current) {
        tagInputRef.current.focus();
      }
    }
  };

  // Handler para remover tags
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handler para tecla "Enter" no input de tag
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handler para upload do documento
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Por favor, selecione um arquivo para upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      await createDocument(
        selectedFile,
        {
          categoryId,
          clientId,
          description,
          tags
        },
        (progress) => {
          setUploadProgress(progress);
        }
      );

      // Upload bem-sucedido
      setUploadSuccess(true);
      toast.success('Documento enviado com sucesso!');
      
      // Aguarda para mostrar 100% de progresso antes de fechar
      setTimeout(() => {
        onUploadComplete();
      }, 1000);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setUploadError(error.message || 'Ocorreu um erro ao fazer upload do documento.');
      toast.error(`Falha no upload: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
  
  // Renderizar mensagens de erro para arquivos rejeitados
  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <div key={file.name} className="text-sm text-destructive mt-2 flex items-center">
      <AlertTriangle className="h-4 w-4 mr-1" />
      <span>
        {file.name} - {errors[0].message}
      </span>
    </div>
  ));

  // Limpar o preview ao desmontar o componente
  React.useEffect(() => {
    return () => {
      if (selectedFile?.preview) {
        URL.revokeObjectURL(selectedFile.preview);
      }
    };
  }, [selectedFile]);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Upload de Documento</CardTitle>
        <CardDescription>
          Faça upload de um documento para o sistema.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Área de Drop ou Seleção de Arquivo */}
        <div 
          {...getRootProps()} 
          className={`
            p-6 border-2 border-dashed rounded-lg mb-4 text-center cursor-pointer
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'}
            ${selectedFile ? 'bg-muted/30' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {selectedFile ? (
            <div className="flex items-center justify-center flex-col">
              <File className="h-10 w-10 text-muted-foreground" />
              <p className="mt-2 font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
              >
                <X className="h-4 w-4 mr-1" /> Remover
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-col">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="font-medium">Arraste e solte seu documento aqui</p>
              <p className="text-sm text-muted-foreground mt-1">ou clique para selecionar um arquivo</p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, TXT, ZIP
                <br />
                Tamanho máximo: 50MB
              </p>
            </div>
          )}
        </div>
        
        {fileRejectionItems}
        
        {/* Mensagens de progresso e status */}
        {uploading && (
          <div className="my-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progresso do upload</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        {uploadError && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center my-4">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
        
        {uploadSuccess && (
          <div className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-3 rounded-md flex items-center my-4">
            <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>Upload concluído com sucesso!</span>
          </div>
        )}

        {/* Campos adicionais */}
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Categoria
            </label>
            <Select 
              value={categoryId} 
              onValueChange={setCategoryId}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="client" className="block text-sm font-medium mb-1">
              Cliente (opcional)
            </label>
            <Select 
              value={clientId} 
              onValueChange={setClientId}
            >
              <SelectTrigger id="client">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum cliente</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Descrição (opcional)
            </label>
            <Textarea
              id="description"
              placeholder="Adicione uma descrição para o documento"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-1">
              Tags (opcional)
            </label>
            <div className="flex">
              <Input
                id="tags"
                ref={tagInputRef}
                placeholder="Adicione tags e pressione Enter"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="flex-1 mr-2"
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Adicionar
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-2 py-1">
                    {tag}
                    <button
                      type="button"
                      className="ml-1 hover:text-destructive"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={uploading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="ml-2"
        >
          {uploading ? 'Enviando...' : 'Fazer Upload'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentUploadForm;
