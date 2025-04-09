const { getDistance } = require("geolib");

async function calculateRiskScore(contextData, userContext) {
  let riskScore = 0;
  let riskFactors = [];

  if (!userContext.knownDevices.includes(contextData.deviceId)) {
    riskScore += 2;
    riskFactors.push("Unknown device");
  }

  const NEARBY_THRESHOLD_KM = 2; // Reduced threshold for "nearby" to account for slight variations

  // Check for known locations (within a tighter radius to account for device variations)
  const isKnownLocation = userContext.knownLocations.some((loc) => {
    const distance = getDistance(
      { latitude: contextData.location.latitude, longitude: contextData.location.longitude },
      { latitude: loc.latitude, longitude: loc.longitude }
    );
    return distance <= (loc.radius ? loc.radius * 1000 : NEARBY_THRESHOLD_KM * 1000); // Use provided radius or default nearby threshold
  });

  // Check for nearby locations (slightly larger radius than the tighter known location check)
  const isNearbyLocation = userContext.knownLocations.some((loc) => {
    const distance = getDistance(
      { latitude: contextData.location.latitude, longitude: contextData.location.longitude },
      { latitude: loc.latitude, longitude: loc.longitude }
    );
    return distance <= NEARBY_THRESHOLD_KM * 1000; // Convert km to meters
  });

  if (!isKnownLocation) {
    if (isNearbyLocation) {
      riskScore += 1; // Even lower risk for very nearby locations with a new device
      riskFactors.push("Login from a new device at a very nearby known location");
    } else {
      // Location is completely new
      riskScore += 6;
      riskFactors.push("Login from unknown location");
    }
  }

  console.log(`Risk factors: ${riskFactors.join(", ") || "None"}`);

  return riskScore;
}

module.exports = { calculateRiskScore };