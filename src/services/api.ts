import axios from 'axios';

interface SearchParams {
  page: number;
  size?: number;
  keyword?: string;
  chain?: string;
}

export const searchCoins = async (params: SearchParams) => {
  const { page, size = 100, keyword = '', chain = '' } = params;
  
  try {
    const response = await axios.post(
      'https://superwallet-markets-stg.coin98.dev/api/coin/search/admx',
      {
        page,
        size,
        keyword,
        chain: chain === 'all' ? '' : chain
      }
    );
    
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching coins:', error);
    throw error;
  }
};
