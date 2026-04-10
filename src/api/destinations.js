export async function fetchDestinations() {
  const response = await fetch("http://localhost:5000/destinations");

  if (!response.ok) {
    throw new Error("Failed to fetch destinations");
  }

  return response.json();
}

export async function fetchCountries() {
  const response = await fetch("http://localhost:5000/countries");
  if (!response.ok) throw new Error("Failed to fetch countries");
  return response.json();
}