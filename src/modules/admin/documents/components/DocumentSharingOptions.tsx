
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Copy, 
  Check, 
  Mail, 
  Link2, 
  Calendar, 
  Clock, 
  Shield, 
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createShareLink } from '../api/documentsApiService';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface DocumentSharingOptionsProps {
  documentId: string;
  documentName: string;
}

const formSchema = z.object({
  email: z.string().email('E-mail inválido').or(z.string().length(0)),
  permission: z.enum(['view', 'edit', 'comment']),
  expiry: z.enum(['never', 'day', 'week', 'month', 'custom']),
  expiryDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const DocumentSharingOptions: React.FC<DocumentSharingOptionsProps> = ({
  documentId,
  documentName
}) => {
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      permission: 'view',
      expiry: 'week',
    },
  });
  
  const selectedExpiry = form.watch('expiry');
  
  const handleGenerateLink = async (values: FormValues) => {
    setIsGeneratingLink(true);
    
    try {
      // Calculate expiry date if needed
      let expiryDate: Date | undefined = undefined;
      
      if (values.expiry === 'day') {
        expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);
      } else if (values.expiry === 'week') {
        expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
      } else if (values.expiry === 'month') {
        expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      } else if (values.expiry === 'custom' && values.expiryDate) {
        expiryDate = values.expiryDate;
      }
      
      // Create share link
      const shareData = await createShareLink(documentId, {
        externalEmail: values.email || undefined,
        permission: values.permission,
        expiresAt: expiryDate
      });
      
      // Generate shareable link
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/shared-document/${shareData.accessToken}`;
      
      setShareLink(link);
      toast.success('Link de compartilhamento gerado com sucesso!');
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error('Erro ao gerar link de compartilhamento.');
    } finally {
      setIsGeneratingLink(false);
    }
  };
  
  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setIsLinkCopied(true);
      toast.success('Link copiado para a área de transferência!');
      
      // Reset copy icon after 2 seconds
      setTimeout(() => {
        setIsLinkCopied(false);
      }, 2000);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Compartilhar "{documentName}"</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Crie um link para compartilhar este documento com outras pessoas
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleGenerateLink)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail (opcional)</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      {...field} 
                      placeholder="Digite um e-mail para notificar" 
                      type="email"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="permission"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Permissões</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="view" id="view" />
                      <Label htmlFor="view" className="flex items-center cursor-pointer">
                        <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <span>Visualização</span>
                          <p className="text-muted-foreground text-xs">Apenas visualizar o documento</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="comment" id="comment" />
                      <Label htmlFor="comment" className="flex items-center cursor-pointer">
                        <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <span>Comentário</span>
                          <p className="text-muted-foreground text-xs">Visualizar e adicionar comentários</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="edit" id="edit" />
                      <Label htmlFor="edit" className="flex items-center cursor-pointer">
                        <Edit className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <span>Edição</span>
                          <p className="text-muted-foreground text-xs">Visualizar, comentar e editar o documento</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="expiry"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Validade do link</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a validade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">1 dia</SelectItem>
                      <SelectItem value="week">7 dias</SelectItem>
                      <SelectItem value="month">30 dias</SelectItem>
                      <SelectItem value="never">Sem validade</SelectItem>
                      <SelectItem value="custom">Data personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {selectedExpiry === 'custom' && (
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de validade</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full pl-3 text-left font-normal flex justify-between items-center"
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span className="text-muted-foreground">Selecione uma data</span>
                          )}
                          <Calendar className="h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <Button
            type="submit"
            className="w-full"
            disabled={isGeneratingLink}
          >
            {isGeneratingLink ? 'Gerando...' : 'Gerar Link de Compartilhamento'}
          </Button>
        </form>
      </Form>
      
      {shareLink && (
        <div className="mt-6 space-y-4">
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Link gerado</h4>
            <div className="flex items-center">
              <div className="flex-1 bg-muted/30 p-2 rounded-l-md truncate">
                <span className="text-sm">{shareLink}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="rounded-l-none"
                onClick={handleCopyLink}
              >
                {isLinkCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSharingOptions;
