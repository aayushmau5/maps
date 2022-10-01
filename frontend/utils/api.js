export async function getDistance(origin, destination) {
  const encodedOrigin = encodeURIComponent(origin);
  const encodedDestination = encodeURIComponent(destination);
  const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}?origin=${encodedOrigin}&destination=${encodedDestination}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    const errorBody = await response.json();
    return {
      error: true,
      errorMessage: errorBody.error,
    };
  }

  const responseData = await response.json();
  return responseData.data;
}
