import crg from 'city-reverse-geocoder'

export default function handler(req, res) {
  const { lat, lon } = req.query
  if (!lat || !lon) return res.status(400).json({ error: 'Missing coordinates' })
  try {
    const [info] = crg(parseFloat(lat), parseFloat(lon), 1)
    if (!info) throw new Error('no result')
    const parts = [info.city, info.region, info.country].filter(Boolean)
    res.status(200).json({ location: parts.join(', ') })
  } catch (err) {
    res.status(500).json({ error: 'Failed to geocode location' })
  }
}
