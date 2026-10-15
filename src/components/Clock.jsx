import { useEffect, useState } from 'react'

const Clock = () => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    console.log('Clock: intervalo iniciado')
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => {
      clearInterval(id)
      console.log('Clock: cleanup ejecutado, intervalo limpiado')
    }
  }, [])

  return <p className="clock">🕒 {now.toLocaleTimeString('es-PE')}</p>
}

export default Clock