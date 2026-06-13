import 'dotenv/config'
import { createApp } from './app.js'
import { startTrackingSimulation } from './lib/trackingSim.js'

const app = createApp()
const PORT = Number(process.env.PORT ?? 3001)

app.listen(PORT, () => {
  console.log(`Horizon API running on http://localhost:${PORT}`)
  startTrackingSimulation(20000)
})
