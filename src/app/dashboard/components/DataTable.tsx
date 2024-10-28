"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { CoinFormModal } from "./CoinFormModal";

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  address: string;
  chain: string;
  status: string;
  vault: boolean;
}

interface DataTableProps {
  data: CoinData[];
  searchQuery: string;
  selectedChain: string;
  onUpdate: (data: CoinData[]) => void;
  isLoading: boolean;
}

export function DataTable({ data, searchQuery, selectedChain, onUpdate, isLoading }: DataTableProps) {
  const [editItem, setEditItem] = useState<CoinData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    onUpdate(data.filter(item => item.id !== id));
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const handleEdit = (updatedItem: CoinData) => {
    onUpdate(data.map(item => item.id === updatedItem.id ? updatedItem : item));
    setEditItem(null);
  };

  return (
    <>
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
              <TableHead>Vault</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.symbol}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <img src={item.image} alt={item.name} className="w-8 h-8 rounded-full object-cover" />
                  </TableCell>
                  <TableCell>{item.address}</TableCell>
                  <TableCell>{item.chain}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell><Checkbox checked={item.vault} /></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditItem(item)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          setItemToDelete(item.id);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editItem && (
        <CoinFormModal 
          open={!!editItem}
          onOpenChange={() => setEditItem(null)}
          onSave={handleEdit}
          item={editItem}
        />
      )}

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => itemToDelete && handleDelete(itemToDelete)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
