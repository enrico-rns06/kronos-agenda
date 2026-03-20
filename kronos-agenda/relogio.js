const canvas = document.getElementById('relogio')
const ctx = canvas.getContext('2d')

canvas.style.position = 'fixed'
canvas.style.top = '50%'
canvas.style.left = '50%'
canvas.style.transform = 'translate(-50%, -50%)'
canvas.style.zIndex = '0'
canvas.style.pointerEvents = 'none'

const SIZE = Math.min(window.innerWidth, window.innerHeight) * 0.7
canvas.width = SIZE
canvas.height = SIZE

const cx = SIZE / 2
const cy = SIZE / 2
const r  = SIZE / 2 - 10

function desenhar() {
    ctx.clearRect(0, 0, SIZE, SIZE)

    const agora   = new Date()
    const horas   = agora.getHours() % 12
    const minutos = agora.getMinutes()
    const segundos = agora.getSeconds()
    const ms      = agora.getMilliseconds()

    const angHora = ((horas + minutos / 60) / 12) * Math.PI * 2 - Math.PI / 2
    const angMin  = ((minutos + segundos / 60) / 60) * Math.PI * 2 - Math.PI / 2
    const angSeg  = ((segundos + ms / 1000) / 60) * Math.PI * 2 - Math.PI / 2

    // Círculo externo
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(123, 79, 233, 0.12)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Círculo interno
    ctx.beginPath()
    ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(123, 79, 233, 0.06)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Marcações das horas
    for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2 - Math.PI / 2
        const x1 = cx + Math.cos(ang) * r * 0.88
        const y1 = cy + Math.sin(ang) * r * 0.88
        const x2 = cx + Math.cos(ang) * r * 0.96
        const y2 = cy + Math.sin(ang) * r * 0.96
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = 'rgba(123, 79, 233, 0.25)'
        ctx.lineWidth = 1.5
        ctx.stroke()
    }

    // Marcações dos minutos
    for (let i = 0; i < 60; i++) {
        if (i % 5 === 0) continue
        const ang = (i / 60) * Math.PI * 2 - Math.PI / 2
        const x1 = cx + Math.cos(ang) * r * 0.92
        const y1 = cy + Math.sin(ang) * r * 0.92
        const x2 = cx + Math.cos(ang) * r * 0.96
        const y2 = cy + Math.sin(ang) * r * 0.96
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = 'rgba(123, 79, 233, 0.1)'
        ctx.lineWidth = 0.5
        ctx.stroke()
    }

    // Ponteiro das horas
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(
        cx + Math.cos(angHora) * r * 0.45,
        cy + Math.sin(angHora) * r * 0.45
    )
    ctx.strokeStyle = 'rgba(123, 79, 233, 0.25)'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.stroke()

    // Ponteiro dos minutos
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(
        cx + Math.cos(angMin) * r * 0.65,
        cy + Math.sin(angMin) * r * 0.65
    )
    ctx.strokeStyle = 'rgba(123, 79, 233, 0.2)'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.stroke()

    // Ponteiro dos segundos
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(
        cx + Math.cos(angSeg) * r * 0.75,
        cy + Math.sin(angSeg) * r * 0.75
    )
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.lineCap = 'round'
    ctx.stroke()

    // Centro
    ctx.beginPath()
    ctx.arc(cx, cy, 3, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(123, 79, 233, 0.4)'
    ctx.fill()

    requestAnimationFrame(desenhar)
}

desenhar()