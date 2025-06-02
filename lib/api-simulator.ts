// API Simulator Configuration
export interface ApiSimulatorConfig {
  enabled: boolean
  delayMs: number
  failureRate: number
  notFoundRate: number
  serverErrorRate: number
}

// Default configuration
let apiSimulatorConfig: ApiSimulatorConfig = {
  enabled: false,
  delayMs: 1000,
  failureRate: 0.1, // 10% chance of failure
  notFoundRate: 0.05, // 5% chance of 404
  serverErrorRate: 0.05, // 5% chance of 500
}

// Get current configuration
export function getApiSimulatorConfig(): ApiSimulatorConfig {
  return { ...apiSimulatorConfig }
}

// Update configuration
export function updateApiSimulatorConfig(config: Partial<ApiSimulatorConfig>): ApiSimulatorConfig {
  apiSimulatorConfig = { ...apiSimulatorConfig, ...config }
  return apiSimulatorConfig
}

// Simulate API response
export async function simulateApiResponse<T>(
  callback: () => Promise<T>,
  customConfig?: Partial<ApiSimulatorConfig>,
): Promise<T> {
  const config = { ...apiSimulatorConfig, ...customConfig }

  // If simulator is disabled, just call the callback
  if (!config.enabled) {
    return callback()
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, config.delayMs))

  // Random number to determine response
  const random = Math.random()

  // Simulate failure
  if (random < config.failureRate) {
    // Determine type of failure
    if (random < config.notFoundRate) {
      throw new Error("NOT_FOUND")
    } else if (random < config.notFoundRate + config.serverErrorRate) {
      throw new Error("SERVER_ERROR")
    } else {
      throw new Error("NETWORK_ERROR")
    }
  }

  // Success case
  return callback()
}

// Helper to simulate API request with fetch
export async function simulatedFetch(
  url: string,
  options?: RequestInit,
  customConfig?: Partial<ApiSimulatorConfig>,
): Promise<Response> {
  try {
    return await simulateApiResponse(() => fetch(url, options), customConfig)
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return new Response(JSON.stringify({ error: "Resource not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    } else if (error.message === "SERVER_ERROR") {
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    } else {
      throw new Error("Network error")
    }
  }
}
