import {
  Transaction,
  TransactionStatus,
  Commission,
  DashboardStats,
} from "../types";
import {
  mockTransactions,
  mockCommissions,
  mockProperties,
  mockLeads,
  mockVisits,
  mockOffers,
} from "../data/properties";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let transactions = [...mockTransactions];
const commissions = [...mockCommissions];

export async function getTransactions(): Promise<Transaction[]> {
  await delay(300);
  return [...transactions];
}

export async function getCommissions(): Promise<Commission[]> {
  await delay(300);
  return [...commissions];
}

export function calculateCommission(
  salePrice: number,
  percentage: number
): number {
  return Math.round(salePrice * (percentage / 100));
}

export async function createTransaction(
  transaction: Omit<Transaction, "id" | "createdAt">
): Promise<Transaction> {
  await delay(300);
  const newTransaction: Transaction = {
    ...transaction,
    id: `txn-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  transactions = [...transactions, newTransaction];
  return newTransaction;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(300);
  const completedTransactions = transactions.filter(
    (t) => t.status === TransactionStatus.COMPLETED
  );
  const totalRevenue = completedTransactions.reduce(
    (sum, t) => sum + t.salePrice,
    0
  );
  const commissionRevenue = completedTransactions.reduce(
    (sum, t) => sum + t.commissionAmount,
    0
  );

  return {
    totalUsers: 4,
    activeProperties: mockProperties.length,
    newProperties: mockProperties.filter(
      (p) =>
        new Date(p.createdAt).getTime() >
        Date.now() - 30 * 24 * 60 * 60 * 1000
    ).length,
    totalLeads: mockLeads.length,
    visits: mockVisits.length,
    offers: mockOffers.length,
    completedTransactions: completedTransactions.length,
    totalRevenue,
    commissionRevenue,
  };
}
