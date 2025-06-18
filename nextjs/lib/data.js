import { promises as fs } from 'fs'
import path from 'path'

export async function readData(name) {
  const dataFile = path.join(process.cwd(), 'nextjs', 'data', name)
  try {
    const data = await fs.readFile(dataFile, 'utf8')
    return JSON.parse(data)
  } catch (e) {
    return []
  }
}

export async function writeData(name, data) {
  const dataFile = path.join(process.cwd(), 'nextjs', 'data', name)
  await fs.mkdir(path.dirname(dataFile), { recursive: true })
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2))
}
