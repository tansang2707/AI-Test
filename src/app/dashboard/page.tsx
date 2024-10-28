"use client";
import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { DataTable } from "./components/DataTable";
import { CoinFormModal } from "./components/CoinFormModal";
import { searchCoins } from "@/services/api";

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

const CHAIN_OPTIONS = ["all", "Sui", "Ethereum", "Solana", "Binance"];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChain, setSelectedChain] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [data, setData] = useState<CoinData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (keyword: string, chain: string, page: number) => {
    setIsLoading(true);
    try {
      const result = await searchCoins({
        page,
        keyword,
        chain
      });
      setData(result);
    } catch (error) {
      console.error('Error fetching coins:', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce((keyword: string, chain: string, page: number) => 
      fetchData(keyword, chain, page), 300),
    []
  );

  useEffect(() => {
    debouncedFetch(searchQuery, selectedChain, currentPage);
  }, [searchQuery, selectedChain, currentPage, debouncedFetch]);

  const handleSave = (newData: Omit<CoinData, "id">) => {
    setData(prev => [...prev, { ...newData, id: String(prev.length + 1) }]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4 flex-1">
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-[300px]"
          />
          <Select value={selectedChain} onValueChange={setSelectedChain}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All chains" />
            </SelectTrigger>
            <SelectContent>
              {CHAIN_OPTIONS.map(chain => (
                <SelectItem key={chain} value={chain.toLowerCase()}>
                  {chain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>+ Add Coin Data</Button>
      </div>

      <DataTable 
        data={data} 
        searchQuery={searchQuery} 
        selectedChain={selectedChain}
        onUpdate={setData}
        isLoading={isLoading}
      />
      
      <CoinFormModal 
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleSave}
      />
    </div>
  );
}
