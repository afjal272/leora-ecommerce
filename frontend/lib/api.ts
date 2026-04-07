const API = process.env.NEXT_PUBLIC_API_URL

export const getProducts = async () => {
  const res = await fetch(`${API}/products`)
  const data = await res.json()
  return data.data
}