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

  static async export(params?: {
    fechaInicio?: string;
    fechaFin?: string;
    categoria?: string;
  }): Promise<Blob> {
    return ApiService.post<Blob>("/expenses/export", params || {}, {
      responseType: "blob",
    });
  }

  static async exportAndDownload(params?: {
    fechaInicio?: string;
    fechaFin?: string;
    categoria?: string;
  }): Promise<void> {
    const blob = await this.export(params);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gastos-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
