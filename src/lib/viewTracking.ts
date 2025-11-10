// Función para trackear visualizaciones de actividades
export async function trackActivityView(activityId: string, referrer?: string) {
  try {
    const response = await fetch('/api/clicks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activityId,
        referrer: referrer || document.referrer || window.location.href
      })
    })

    if (!response.ok) {
      console.warn('Failed to track view:', response.statusText)
      return false
    }

    const data = await response.json()
    
    // El backend puede retornar success=true pero no registrar la visualización 
    // (por ejemplo, si es la empresa viendo su propia actividad)
    if (data.message) {
      console.debug('View tracking:', data.message)
    }
    
    return data.success
  } catch (error) {
    console.warn('Error tracking view:', error)
    return false
  }
}

// Hook para usar el tracking de visualizaciones con throttling
export function useViewTracking() {
  const trackView = async (activityId: string, referrer?: string) => {
    // Implementar throttling para evitar múltiples visualizaciones muy rápidas
    const lastView = localStorage.getItem(`last_view_${activityId}`)
    const now = Date.now()
    
    if (lastView && now - parseInt(lastView) < 5000) {
      // No trackear si han pasado menos de 5 segundos
      return false
    }
    
    localStorage.setItem(`last_view_${activityId}`, now.toString())
    return await trackActivityView(activityId, referrer)
  }

  return { trackView }
}

// Mantener compatibilidad con nombres anteriores
export const trackActivityClick = trackActivityView
export const useClickTracking = useViewTracking