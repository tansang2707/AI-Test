"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Chain from "@/components/Chain";
import { Badge } from "@/components/ui/badge";

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  address: string;
  chain: string;
  isActive: boolean;
}

interface DataTableProps {
  data: CoinData[];
  isLoading: boolean;
}

export function DataTable({ data, isLoading }: DataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Chain</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Loading...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No results found
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.symbol}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <img src={item.image} alt={item.name} className="w-8 h-8 rounded-full object-cover" />
                </TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>
                  <Chain chainId={item.chain} />
                </TableCell>
                <TableCell>
                  <Badge variant={item.isActive ? "default" : "secondary"}>
                    {item.isActive ? "Activated" : "Deactivated"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
