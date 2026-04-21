import { ApiService } from "@/services/libs/ApiService";
import type {
  IExpense,
  ICreateExpenseInput,
  IUpdateExpenseInput,
  IDashboardData,
} from "@/types/expense";

export class ExpenseService {
  static async getAll(params?: {
    category?: string;
    from?: string;
    to?: string;
  }): Promise<IExpense[]> {
    return ApiService.get<IExpense[]>("/expenses", { params });
  }

  static async create(data: ICreateExpenseInput): Promise<IExpense> {
    return ApiService.post<IExpense>("/expenses", data);
  }

  static async update(
    id: string,
    data: IUpdateExpenseInput,
  ): Promise<IExpense> {
    return ApiService.put<IExpense>(`/expenses/${id}`, data);
  }

  static async delete(id: string): Promise<{ message: string }> {
    return ApiService.delete<{ message: string }>(`/expenses/${id}`);
  }

  static async getDashboardStats(): Promise<IDashboardData> {
    return ApiService.get<IDashboardData>("/dashboard");
  }
}
