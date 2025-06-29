
import React from 'react';
import { CalendarClock, Clock, BadgeCheck, BadgeX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LoanHistoryTableProps {
  loans: any[];
}

export const LoanHistoryTable: React.FC<LoanHistoryTableProps> = ({ loans }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Term</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan, index) => (
            <TableRow key={index}>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  {new Date(loan.requestDate).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell className="font-medium">${loan.amount}</TableCell>
              <TableCell>{loan.durationMonths} months</TableCell>
              <TableCell>
                <Badge variant={
                  loan.status === 'repaid' ? "success" : 
                  loan.status === 'funded' ? "default" : 
                  loan.status === 'pending' ? "outline" : "destructive"
                }>
                  {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {loan.status === 'funded' || loan.status === 'repaid' ? (
                  <div className="flex items-center gap-1">
                    {loan.onTime ? (
                      <BadgeCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <BadgeX className="h-4 w-4 text-red-500" />
                    )}
                    <span className={loan.onTime ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                      {loan.onTime ? "On Time" : "Late"}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Pending</span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
