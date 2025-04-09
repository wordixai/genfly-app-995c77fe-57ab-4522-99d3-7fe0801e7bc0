import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { Dashboard } from '@/components/Dashboard';
import { CategoryManager } from '@/components/CategoryManager';
import { Plus } from 'lucide-react';
import { TransactionType } from '@/lib/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

  const handleIncomeSubmit = () => {
    setIsIncomeDialogOpen(false);
  };

  const handleExpenseSubmit = () => {
    setIsExpenseDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">个人记账</h1>

      <div className="flex justify-center space-x-4 mb-6">
        <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700">
              <Plus className="mr-2 h-4 w-4" /> 添加收入
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加收入</DialogTitle>
            </DialogHeader>
            <TransactionForm onSubmit={handleIncomeSubmit} type="income" />
          </DialogContent>
        </Dialog>

        <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700">
              <Plus className="mr-2 h-4 w-4" /> 添加支出
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加支出</DialogTitle>
            </DialogHeader>
            <TransactionForm onSubmit={handleExpenseSubmit} type="expense" />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">概览</TabsTrigger>
          <TabsTrigger value="income">收入</TabsTrigger>
          <TabsTrigger value="expense">支出</TabsTrigger>
          <TabsTrigger value="categories">分类</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <Dashboard />
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">最近交易</h2>
            <TransactionList />
          </div>
        </TabsContent>
        
        <TabsContent value="income" className="mt-6">
          <h2 className="text-xl font-bold mb-4">收入记录</h2>
          <TransactionList type="income" />
        </TabsContent>
        
        <TabsContent value="expense" className="mt-6">
          <h2 className="text-xl font-bold mb-4">支出记录</h2>
          <TransactionList type="expense" />
        </TabsContent>
        
        <TabsContent value="categories" className="mt-6">
          <CategoryManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;