import { createContext, useContext, useEffect, useState } from "react";
import { fakeFetchCrypto, fetchAssets } from "../api.js";
import { percentDifference } from "../utils.js";

const CryptoContext = createContext({
  assets: [],
  crypto: [],
  loading: false,
});

// eslint-disable-next-line react/prop-types
export function CryptoContextProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [crypto, setCrypto] = useState([]);
  const [assets, setAssets] = useState([]);

  function mapAssets(assets, result) {
    return assets.map((asset) => {
      const coin = result.find((c) => c.id === asset.id);
      return {
        grow: asset.price < coin.price,
        growPercent: percentDifference(asset.price, coin.price),
        totalAmount: asset.amount * coin.price,
        totalProfit: asset.amount * coin.price - asset.amount * asset.price,
        name: coin.name,
        ...asset,
      };
    });
  }

  useEffect(() => {
    async function preload() {
      setLoading(true);
      const { result } = await fakeFetchCrypto();
      const assets = await fetchAssets();

      setAssets(mapAssets(assets, result));
      setCrypto(result);

      setLoading(false);
    }
    preload();
  }, []);

  function addAssets(newAsset) {
    setAssets((prevState) => mapAssets([...prevState, newAsset], crypto));
  }

  return (
    <CryptoContext.Provider value={{ loading, crypto, assets, addAssets }}>
      {children}
    </CryptoContext.Provider>
  );
}

export default CryptoContext;

// eslint-disable-next-line react-refresh/only-export-components
export function useCrypto() {
  return useContext(CryptoContext);
}
