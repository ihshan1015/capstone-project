import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('compareList');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (product) => {
    if (compareList.length >= 4) {
      toast.error('You can compare up to 4 products only.');
      return;
    }
    if (compareList.length > 0 && compareList[0].category_id !== product.category_id && compareList[0].category !== product.category) {
      toast.error('You can only compare products from the same category.');
      return;
    }
    if (compareList.find(p => p.id === product.id)) {
      toast.warning('Product already in compare list.');
      return;
    }
    setCompareList([...compareList, product]);
    toast.success('Added to compare list');
  };

  const removeFromCompare = (productId) => {
    setCompareList(compareList.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (productId) => {
    return !!compareList.find(p => p.id === productId);
  };

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare
    }}>
      {children}
    </CompareContext.Provider>
  );
};
