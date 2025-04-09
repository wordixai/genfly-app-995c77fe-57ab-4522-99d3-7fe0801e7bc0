import { useState } from 'react';
import { format } from 'date-fns';
import { useFinanceStore } from '@/lib/store';
import { Transaction, TransactionType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { TransactionForm } from './TransactionForm';
import { Edit, Trash2 } from 'lucide-react';

interface TransactionListProps {
  type?: TransactionType;
}

export function TransactionList({ type }: TransactionListProps) {
  const { transactions, categories, deleteTransaction } = useFinanceStore();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter transactions by type if provided
  const filteredTransactions = type 
    ? transactions.filter(t => t.type === type)
    : transactions;

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? `${category.icon} ${category.name}` : '未分类';
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
  };

  const handleFormSubmit = () => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
  };

  if (filteredTransactions.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">暂无记录</div>;
  }

  return (
    <div className="space-y-4">
      {filteredTransactions.map((transaction) => (
        <Card key={transaction.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {getCategoryName(transaction.categoryId)}
                  </div>
                  <div className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toFixed(2)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {transaction.description || '无描述'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {format(new Date(transaction.date), 'yyyy-MM-dd')}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(transaction)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认删除</AlertDialogTitle>
                      <AlertDialogDescription>
                        确定要删除这条记录吗？此操作无法撤销。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(transaction.id)}>
                        删除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑记录</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <TransactionForm 
              transaction={editingTransaction} 
              onSubmit={handleFormSubmit}
              type={editingTransaction.type}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}