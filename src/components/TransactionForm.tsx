import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFinanceStore } from '@/lib/store';
import { Transaction, TransactionType } from '@/lib/types';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: () => void;
  type: TransactionType;
}

export function TransactionForm({ transaction, onSubmit, type }: TransactionFormProps) {
  const { categories, addTransaction, editTransaction } = useFinanceStore();
  const [date, setDate] = useState<Date>(transaction?.date ? new Date(transaction.date) : new Date());

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<Omit<Transaction, 'id'>>({
    defaultValues: transaction ? {
      ...transaction,
    } : {
      type,
      amount: 0,
      description: '',
      categoryId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    }
  });

  // Filter categories by transaction type
  const filteredCategories = categories.filter(category => category.type === type);

  useEffect(() => {
    if (transaction) {
      setValue('amount', transaction.amount);
      setValue('description', transaction.description);
      setValue('categoryId', transaction.categoryId);
      setValue('date', transaction.date);
      setValue('type', transaction.type);
      setDate(new Date(transaction.date));
    } else {
      setValue('type', type);
    }
  }, [transaction, setValue, type]);

  const onFormSubmit = (data: Omit<Transaction, 'id'>) => {
    const formattedData = {
      ...data,
      amount: Number(data.amount),
      date: format(date, 'yyyy-MM-dd'),
    };

    if (transaction) {
      editTransaction(transaction.id, formattedData);
    } else {
      addTransaction(formattedData);
    }
    
    reset();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">金额</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="输入金额"
          {...register('amount', { required: '请输入金额', min: { value: 0.01, message: '金额必须大于0' } })}
        />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">分类</Label>
        <Select 
          onValueChange={(value) => setValue('categoryId', value)} 
          defaultValue={transaction?.categoryId}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.icon} {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">日期</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'yyyy-MM-dd') : <span>选择日期</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                setDate(date || new Date());
                setValue('date', format(date || new Date(), 'yyyy-MM-dd'));
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          placeholder="输入描述信息"
          {...register('description')}
        />
      </div>

      <input type="hidden" {...register('type')} />

      <Button type="submit" className="w-full">
        {transaction ? '更新' : '添加'}
      </Button>
    </form>
  );
}