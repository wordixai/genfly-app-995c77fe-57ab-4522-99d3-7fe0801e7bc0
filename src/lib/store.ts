import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, Category, Stats } from './types';

interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  editTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  editCategory: (id: string, category: Omit<Category, 'id'>) => void;
  getStats: () => Stats;
}

// Default categories
const defaultCategories: Category[] = [
  { id: uuidv4(), name: '工资', type: 'income', icon: '💰' },
  { id: uuidv4(), name: '奖金', type: 'income', icon: '🎁' },
  { id: uuidv4(), name: '投资', type: 'income', icon: '📈' },
  { id: uuidv4(), name: '其他收入', type: 'income', icon: '💵' },
  { id: uuidv4(), name: '餐饮', type: 'expense', icon: '🍔' },
  { id: uuidv4(), name: '购物', type: 'expense', icon: '🛒' },
  { id: uuidv4(), name: '交通', type: 'expense', icon: '🚗' },
  { id: uuidv4(), name: '住房', type: 'expense', icon: '🏠' },
  { id: uuidv4(), name: '娱乐', type: 'expense', icon: '🎬' },
  { id: uuidv4(), name: '医疗', type: 'expense', icon: '💊' },
  { id: uuidv4(), name: '教育', type: 'expense', icon: '📚' },
  { id: uuidv4(), name: '其他支出', type: 'expense', icon: '📝' },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: defaultCategories,
      
      addTransaction: (transaction) => {
        const newTransaction = { ...transaction, id: uuidv4() };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },
      
      editTransaction: (id, transaction) => {
        set((state) => ({
          transactions: state.transactions.map((t) => 
            t.id === id ? { ...transaction, id } : t
          ),
        }));
      },
      
      addCategory: (category) => {
        const newCategory = { ...category, id: uuidv4() };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },
      
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },
      
      editCategory: (id, category) => {
        set((state) => ({
          categories: state.categories.map((c) => 
            c.id === id ? { ...category, id } : c
          ),
        }));
      },
      
      getStats: () => {
        const { transactions } = get();
        
        const totalIncome = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const totalExpense = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
          
        return {
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
        };
      },
    }),
    {
      name: 'finance-storage',
    }
  )
);