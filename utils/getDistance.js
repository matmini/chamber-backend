export async  function getDistance(lat, lng){
  const upGateCoordinates = {lat: 14.167405, lng: 121.243347};
  const url = `https://router.project-osrm.org/route/v1/foot/${upGateCoordinates.lng},${upGateCoordinates.lat};${lng},${lat}?overview=false`;
  let distance = null;

  try {
    const response = await fetch(url);
    const data = await response.json(); 
    if (data.code === 'Ok') {
      distance = data.routes[0].distance;
    }
  }catch(err) {
    console.log(`[ERROR here] ${err.message}`);
  }
  // console.log(`Distance computed: ${distance}`);
  return distance;
}