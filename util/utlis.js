import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';


export const setPrayerData = async (date, prayerName, performed, withJamat) => {
    try {
        const key = `prayer_${date}`;
        const existingData = await AsyncStorage.getItem(key);
        const prayerData = existingData ? JSON.parse(existingData) : {};

        prayerData[prayerName] = { performed, withJamat };
        await AsyncStorage.setItem(key, JSON.stringify(prayerData));
    } catch (error) {
        console.error('Error setting prayer data:', error);
    }
};


export const getPrayerData = async (date) => {
    try {
        const key = `prayer_${date}`;
        const data = await AsyncStorage.getItem(key);
        const defaultData = getDefaultPrayersData()
        return data ? { ...defaultData, ...JSON.parse(data) } : getDefaultPrayersData();
    } catch (error) {
        console.error('Error getting prayer data:', error);
        return {};
    }
};

export const getAllPrayerData = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const prayerKeys = keys.filter(key => key.startsWith('prayer_'));
        const stores = await AsyncStorage.multiGet(prayerKeys);

        const allData = {};
        stores.forEach(([key, value]) => {
            const date = key.replace('prayer_', '');
            const defaultData = getDefaultPrayersData();
            allData[new Date(date)] = { ...defaultData, ...JSON.parse(value) };
        });

        return allData;
    } catch (error) {
        console.error('Error getting all prayer data:', error);
        return {};
    }
};

const getDefaultPrayersData = () => {
    return {
        fajr: { performed: false, withJamat: false },
        dhuhr: { performed: false, withJamat: false },
        asr: { performed: false, withJamat: false },
        maghrib: { performed: false, withJamat: false },
        isha: { performed: false, withJamat: false },
    };
}


export const editPrayerData = async (date, prayerName, updatedData) => {
    try {
        const key = `prayer_${date}`;
        const existingData = await AsyncStorage.getItem(key);
        const prayerData = existingData ? JSON.parse(existingData) : {};

        if (!prayerData[prayerName]) {
            prayerData[prayerName] = {};
        }

        prayerData[prayerName] = { 
            ...getDefaultPrayersData(),
            ...prayerData[prayerName], 
            ...updatedData };
        await AsyncStorage.setItem(key, JSON.stringify(prayerData));
    } catch (error) {
        console.error('Error editing prayer data:', error);
    }
};

export async function getAddressFromCoordinates(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',
      },
    });
    return response.data.display_name;
  } catch (error) {
    console.error('Error fetching address:', error);
    return null;
  }
}

// Get prayer timings from address and date
export async function getPrayerTimings(address, date) {
  const url = `https://api.aladhan.com/v1/timingsByAddress/${date}`;
  try {
    const response = await axios.get(url, {
      params: {
        address: address,
        method: '1',
        shafaq: 'general',
        tune: '1,2,3,4,5',
        calendarMethod: 'UAQ',
      },
      headers: {
        accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching prayer timings:', error);
    return null;
  }
}
