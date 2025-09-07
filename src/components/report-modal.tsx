
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Printer } from "lucide-react";
import type { ReportData } from "@/lib/types";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ReportData | null;
}

export default function ReportModal({ isOpen, onClose, reportData }: ReportModalProps) {
  if (!reportData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // This is a placeholder for CSV download logic
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += reportData.headers.join(",") + "\n";
    reportData.rows.forEach(rowArray => {
        let row = rowArray.join(",");
        csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportData.title.replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl">{reportData.title}</DialogTitle>
          <DialogDescription>
            A detailed view of the requested report. You can print or download this data.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden px-6">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader className="sticky top-0 bg-secondary">
                <TableRow>
                  {reportData.headers.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex} className="font-medium">{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
        <DialogFooter className="p-6 bg-secondary/50 border-t">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download as CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
