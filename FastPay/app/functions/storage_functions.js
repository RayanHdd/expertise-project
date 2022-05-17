export const readData = async (AsyncStorage, storage_key) => {
  try {
    const signedup = await AsyncStorage.getItem(storage_key);

    return signedup;
  } catch (e) {
    alert("Failed to fetch the data from storage");
  }
};

export const readDataAsync = (AsyncStorage, storage_key) => {
  return new Promise((resolve) => {
    try {
      const signedup = AsyncStorage.getItem(storage_key);

      resolve(signedup);
    } catch (e) {
      alert("Failed to fetch the data from storage");
    }
  });
};

export const saveData = async (AsyncStorage, storage_key, data) => {
  try {
    await AsyncStorage.setItem(storage_key, data);
    alert("Data successfully saved");
  } catch (e) {
    alert("Failed to save the data to the storage");
  }
};
