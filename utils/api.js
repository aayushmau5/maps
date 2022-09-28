export async function getDistance(origin, destination) {
  const encodedOrigin = encodeURIComponent(origin);
  const encodedDestination = encodeURIComponent(destination);
  const endpoint = `http://localhost:8000/?origin=${encodedOrigin}&destination=${encodedDestination}`;

  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
}
