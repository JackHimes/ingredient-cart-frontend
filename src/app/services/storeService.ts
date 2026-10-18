import axios from 'axios';

const STORE_KEY = "kroger_store";

export interface KrogerStore {
  locationId: string;
  name: string;
  address: string;
}

const getStoredStore = (): KrogerStore | null => {
  const localStoredStore = localStorage.getItem(STORE_KEY);
  if (!localStoredStore) return null;

  try {
    const parsedStore = JSON.parse(localStoredStore);
    if (typeof parsedStore?.locationId !== 'string') {
      localStorage.removeItem(STORE_KEY);
      return null;
    }
    return parsedStore as KrogerStore;
  } catch (error) {
    console.error("Error parsing stored store:", error);
    localStorage.removeItem(STORE_KEY);
    return null;
  }
};

const saveStore = (store: KrogerStore) => {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
};

const findStores = async (zipCode: string, token: string): Promise<KrogerStore[]> => {
  const response = await axios.get("http://localhost:3333/locations", {
    params: { zipCode },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return (response.data ?? []).map((location: any) => ({
    locationId: location.locationId,
    name: location.name,
    address: [
      location.address?.addressLine1,
      location.address?.city,
      location.address?.state,
    ]
      .filter(Boolean)
      .join(", "),
  }));
};

export { getStoredStore, saveStore, findStores };
