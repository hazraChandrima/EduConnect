const { getDistance } = require("geolib");

async function calculateRiskScore(contextData, userContext) {
  let riskScore = 0;
  let riskFactors = [];

  if (!userContext.knownDevices.includes(contextData.deviceId)) {
    riskScore += 2;
    riskFactors.push("Unknown device");
  }

  const NEARBY_THRESHOLD_KM = 20; // Consider locations within 20km as "nearby"

  // Check for known locations (exact matches within specified radius)
  const isKnownLocation = userContext.knownLocations.some((loc) => {
    const distance = getDistance(
      { latitude: contextData.location.latitude, longitude: contextData.location.longitude },
      { latitude: loc.latitude, longitude: loc.longitude }
    );
    return distance <= loc.radius * 1000;
  });

  // Check for nearby locations (not exact match but close enough)
  const isNearbyLocation = userContext.knownLocations.some((loc) => {
    const distance = getDistance(
      { latitude: contextData.location.latitude, longitude: contextData.location.longitude },
      { latitude: loc.latitude, longitude: loc.longitude }
    );
    return distance <= NEARBY_THRESHOLD_KM * 1000; // Convert km to meters
  });

  if (!isKnownLocation) {
    if (isNearbyLocation) {
      riskScore += 2; // Lower risk for nearby locations
      riskFactors.push("Login from nearby but not exact known location");
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