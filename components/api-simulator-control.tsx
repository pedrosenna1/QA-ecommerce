"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { getApiSimulatorConfig, updateApiSimulatorConfig, type ApiSimulatorConfig } from "@/lib/api-simulator"
import { Settings, X } from "lucide-react"

export default function ApiSimulatorControl() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<ApiSimulatorConfig>(getApiSimulatorConfig())

  // Update local state when config changes
  const handleConfigChange = (partialConfig: Partial<ApiSimulatorConfig>) => {
    const newConfig = updateApiSimulatorConfig(partialConfig)
    setConfig(newConfig)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 flex items-center justify-center bg-purple-600 hover:bg-purple-700 shadow-lg"
          aria-label="API Simulator Settings"
          data-testid="api-simulator-button"
        >
          <Settings className="h-6 w-6" />
        </Button>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-lg border w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">API Simulator</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8" aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="simulator-enabled" className="cursor-pointer">
                Simulador Ativado
              </Label>
              <Switch
                id="simulator-enabled"
                checked={config.enabled}
                onCheckedChange={(checked) => handleConfigChange({ enabled: checked })}
                data-testid="simulator-toggle"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delay-ms">Atraso (ms): {config.delayMs}</Label>
              <Slider
                id="delay-ms"
                min={0}
                max={5000}
                step={100}
                value={[config.delayMs]}
                onValueChange={(value) => handleConfigChange({ delayMs: value[0] })}
                disabled={!config.enabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="failure-rate">Taxa de Falha: {(config.failureRate * 100).toFixed(0)}%</Label>
              <Slider
                id="failure-rate"
                min={0}
                max={1}
                step={0.05}
                value={[config.failureRate]}
                onValueChange={(value) => handleConfigChange({ failureRate: value[0] })}
                disabled={!config.enabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="not-found-rate">Taxa de 404: {(config.notFoundRate * 100).toFixed(0)}%</Label>
              <Slider
                id="not-found-rate"
                min={0}
                max={1}
                step={0.05}
                value={[config.notFoundRate]}
                onValueChange={(value) => handleConfigChange({ notFoundRate: value[0] })}
                disabled={!config.enabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="server-error-rate">Taxa de 500: {(config.serverErrorRate * 100).toFixed(0)}%</Label>
              <Slider
                id="server-error-rate"
                min={0}
                max={1}
                step={0.05}
                value={[config.serverErrorRate]}
                onValueChange={(value) => handleConfigChange({ serverErrorRate: value[0] })}
                disabled={!config.enabled}
              />
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  handleConfigChange({
                    delayMs: 1000,
                    failureRate: 0.1,
                    notFoundRate: 0.05,
                    serverErrorRate: 0.05,
                  })
                }
                disabled={!config.enabled}
                data-testid="reset-simulator"
              >
                Resetar Configurações
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
