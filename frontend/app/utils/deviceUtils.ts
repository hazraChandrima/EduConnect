// import * as Device from 'expo-device';
// import * as Location from 'expo-location';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Platform } from 'react-native';
// import { v4 as uuidv4 } from 'uuid'; // Make sure to install uuid package

// export interface LocationData {
//     latitude: number;
//     longitude: number;
//     city?: string;
//     country?: string;
// }

// /**
//  * Gets or generates a device identifier
//  */
// export const getDeviceId = async (): Promise<string> => {
//     try {
//         // Check if we have a stored device ID
//         const storedDeviceId = await AsyncStorage.getItem('device_id');

//         if (storedDeviceId) {
//             return storedDeviceId;
//         }

//         // Generate a new device ID
//         const deviceName = Device.deviceName || 'unknown-device';
//         const deviceId = `${deviceName}-${uuidv4().substring(0, 8)}`;

//         // Store for future use
//         await AsyncStorage.setItem('device_id', deviceId);

//         return deviceId;
//     } catch (error) {
//         console.error('Error getting device ID:', error);
//         // Fallback device ID
//         return `device-${Date.now()}`;
//     }
// };

// /**
//  * Gets device location data
//  */
// export const getLocationData = async (): Promise<LocationData> => {
//     try {
//         // Request location permissions
//         const { status } = await Location.requestForegroundPermissionsAsync();

//         if (status !== 'granted') {
//             console.log('Location permission denied');
//             // Return default location data
//             return {
//                 latitude: 0,
//                 longitude: 0,
//                 city: 'Unknown',
//                 country: 'Unknown'
//             };
//         }

//         // Get current position
//         const location = await Location.getCurrentPositionAsync({
//             accuracy: Location.Accuracy.Balanced
//         });

//         // Get reverse geocode information
//         const addresses = await Location.reverseGeocodeAsync({
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude
//         });

//         const firstAddress = addresses[0];

//         return {
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//             city: firstAddress?.city || 'Unknown',
//             country: firstAddress?.country || 'Unknown'
//         };
//     } catch (error) {
//         console.error('Error getting location:', error);
//         // Return default location data if there's an error
//         return {
//             latitude: 0,
//             longitude: 0,
//             city: 'Unknown',
//             country: 'Unknown'
//         };
//     }
// };

// /**
//  * Gets complete context data for login security
//  */
// export const getLoginContextData = async () => {
//     const deviceId = await getDeviceId();
//     const location = await getLocationData();

//     return {
//         deviceId,
//         location,
//         deviceInfo: {
//             model: Device.modelName || 'Unknown',
//             osName: Device.osName || 'Unknown',
//             osVersion: Device.osVersion || 'Unknown'
//         },
//         platform: Platform.OS,
//         timestamp: new Date().toISOString()
//     };
// };