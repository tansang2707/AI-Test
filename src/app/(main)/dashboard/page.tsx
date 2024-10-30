"use client";
import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import Chain from "@/components/Chain";
import { CHAIN_DATA } from "@/common/constant";
import { DataTable } from "./components/DataTable";
import { CoinFormModal } from "./components/CoinFormModal";
import { searchCoins, SearchResponse } from "@/services/api";

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

const CHAIN_OPTIONS = ["all", ...Object.keys(CHAIN_DATA)];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChain, setSelectedChain] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [data, setData] = useState<CoinData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 100;

  const fetchData = async (keyword: string, chain: string, page: number) => {
    setIsLoading(true);
    try {
      const result: SearchResponse = await searchCoins({
        page,
        size: pageSize,
        keyword,
        chain
      });
      setData(result.data);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error('Error fetching coins:', error);
      setData([]);
      setTotalPages(1);
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

  const handleEdit = (id: string) => {
    console.log('Edit coin:', id);
    // Edit functionality to be implemented
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
            <SelectTrigger className="w-[200px]">
              <SelectValue>
                {selectedChain === "all" ? (
                  "All chains"
                ) : (
                  <Chain chainId={selectedChain} />
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CHAIN_OPTIONS.map(chain => (
                <SelectItem key={chain} value={chain}>
                  {chain === "all" ? (
                    "All chains"
                  ) : (
                    <Chain chainId={chain} />
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>+ Add Coin Data</Button>
      </div>

      <DataTable 
      //@ts-ignore
        data={data} 
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          fetchData(searchQuery, selectedChain, page);
        }}
        onEdit={handleEdit}
      />
      
      <CoinFormModal 
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleSave}
      />
    </div>
  );
}
