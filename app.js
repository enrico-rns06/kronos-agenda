import { db } from './firebase.js'
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'

const sessao = localStorage.getItem('sessao')

const meses = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
]

const diasSemana = [
    'domingo','segunda','terça','quarta','quinta','sexta','sábado'
]

if (!sessao) {
    window.location.href = 'login.html'
}

document.getElementById('nomeUsuario').textContent = 'Olá, ' + sessao + '!'

document.getElementById('btnSair').addEventListener('click', function() {
    localStorage.removeItem('sessao')
    alert('Encerrando sessão!')
    window.location.href = 'login.html'
})

let hoje = new Date()
let anoAtual = hoje.getFullYear()
let mesAtual = hoje.getMonth()
let diaSelecionado = null
let tarefas = {}

// Drag and drop state
let dragSrcIndex = null
let dragChave = null

function chave(ano, mes, dia) {
    return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
}

async function salvar() {
    const ref = doc(db, 'usuarios', sessao)
    await setDoc(ref, { tarefas: tarefas })
}

async function carregarTarefas() {
    const ref = doc(db, 'usuarios', sessao)
    const snap = await getDoc(ref)
    if (snap.exists()) {
        tarefas = snap.data().tarefas || {}
    }
    renderizarCalendario()
}

function renderizarCalendario() {
    document.getElementById('monthTitle').innerHTML =
        `${meses[mesAtual]} <span>${anoAtual}</span>`

    const cal = document.getElementById('calendar')
    cal.innerHTML = ''

    const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay()
    const totalDias   = new Date(anoAtual, mesAtual + 1, 0).getDate()
    const diasAntes   = new Date(anoAtual, mesAtual, 0).getDate()

    for (let i = primeiroDia - 1; i >= 0; i--) {
        const d = document.createElement('div')
        d.className = 'day other-month'
        d.innerHTML = `<div class="day-number">${diasAntes - i}</div>`
        cal.appendChild(d)
    }

    for (let dia = 1; dia <= totalDias; dia++) {
        const k = chave(anoAtual, mesAtual, dia)
        const ehHoje = (
            dia === hoje.getDate() &&
            mesAtual === hoje.getMonth() &&
            anoAtual === hoje.getFullYear()
        )
        const tarefasDia = tarefas[k] || []

        const d = document.createElement('div')
        d.className = 'day' + (ehHoje ? ' today' : '')
        d.onclick = () => abrirModal(dia)

        let pillsHTML = ''
        tarefasDia.slice(0, 3).forEach(t => {
            pillsHTML += `<div class="task-pill ${t.done ? 'done' : ''}">${t.texto}</div>`
        })
        if (tarefasDia.length > 3) {
            pillsHTML += `<div class="more-tasks">+${tarefasDia.length - 3} mais</div>`
        }

        d.innerHTML = `
            <div class="day-number">${dia}</div>
            <div class="day-tasks">${pillsHTML}</div>
        `
        cal.appendChild(d)
    }
}

function mudarMes(direcao) {
    mesAtual += direcao
    if (mesAtual > 11) { mesAtual = 0; anoAtual++ }
    if (mesAtual < 0)  { mesAtual = 11; anoAtual-- }
    renderizarCalendario()
}

function abrirModal(dia) {
    diaSelecionado = dia
    const k = chave(anoAtual, mesAtual, dia)
    const data = new Date(anoAtual, mesAtual, dia)
    const nomeDia = diasSemana[data.getDay()]

    document.getElementById('modalDate').textContent =
        `${nomeDia}, ${dia} de ${meses[mesAtual].toLowerCase()} de ${anoAtual}`

    renderizarModalTarefas(k)
    document.getElementById('overlay').classList.add('open')
    setTimeout(() => document.getElementById('taskInput').focus(), 200)
}

function fecharModal(event) {
    if (event && event.target != document.getElementById('overlay')) return
    document.getElementById('overlay').classList.remove('open')
    document.getElementById('taskInput').value = ''
    diaSelecionado = null
    renderizarCalendario()
}

async function adicionarTarefaDia() {
    if (!diaSelecionado) return
    const input = document.getElementById('taskInput')
    const texto = input.value.trim()
    if (!texto) return

    const k = chave(anoAtual, mesAtual, diaSelecionado)
    if (!tarefas[k]) tarefas[k] = []
    tarefas[k].push({ id: Date.now(), texto, done: false })
    await salvar()
    renderizarModalTarefas(k)
    input.value = ''
    input.focus()
}

async function toggleTarefa(k, id) {
    const t = (tarefas[k] || []).find(t => t.id === id)
    if (t) {
        t.done = !t.done
        await salvar()
        renderizarModalTarefas(k)
    }
}

async function excluirTarefa(k, id) {
    tarefas[k] = (tarefas[k] || []).filter(t => t.id !== id)
    await salvar()
    renderizarModalTarefas(k)
}

// ─── EDITAR TAREFA ───────────────────────────────────────────────────────────

function iniciarEdicao(k, id, spanEl) {
    // Evita abrir dois inputs ao mesmo tempo
    if (document.querySelector('.edit-input')) return

    const tarefa = (tarefas[k] || []).find(t => t.id === id)
    if (!tarefa) return

    const input = document.createElement('input')
    input.type = 'text'
    input.value = tarefa.texto
    input.className = 'edit-input'
    input.maxLength = 60

    spanEl.replaceWith(input)
    input.focus()
    input.select()

    async function confirmar() {
        const novoTexto = input.value.trim()
        if (novoTexto && novoTexto !== tarefa.texto) {
            tarefa.texto = novoTexto
            await salvar()
        }
        renderizarModalTarefas(k)
    }

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); confirmar() }
        if (e.key === 'Escape') renderizarModalTarefas(k)
    })

    input.addEventListener('blur', confirmar)
}

// ─── DRAG AND DROP ───────────────────────────────────────────────────────────

function onDragStart(e, index, k) {
    dragSrcIndex = index
    dragChave = k
    e.currentTarget.classList.add('dragging')
    e.dataTransfer.effectAllowed = 'move'
}

function onDragEnd(e) {
    e.currentTarget.classList.remove('dragging')
    document.querySelectorAll('.modal-task').forEach(el => el.classList.remove('drag-over'))
}

function onDragOver(e, index) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    document.querySelectorAll('.modal-task').forEach(el => el.classList.remove('drag-over'))
    if (index !== dragSrcIndex) {
        e.currentTarget.classList.add('drag-over')
    }
}

function onDragLeave(e) {
    e.currentTarget.classList.remove('drag-over')
}

async function onDrop(e, targetIndex, k) {
    e.preventDefault()
    e.currentTarget.classList.remove('drag-over')

    if (dragSrcIndex === null || dragSrcIndex === targetIndex || dragChave !== k) return

    const lista = tarefas[k]
    const [movido] = lista.splice(dragSrcIndex, 1)
    lista.splice(targetIndex, 0, movido)

    dragSrcIndex = null
    dragChave = null

    await salvar()
    renderizarModalTarefas(k)
}

// ─── RENDER MODAL ────────────────────────────────────────────────────────────

function renderizarModalTarefas(k) {
    const lista = document.getElementById('modalTasks')
    const items = tarefas[k] || []

    if (items.length === 0) {
        lista.innerHTML = '<p class="empty-modal">Nenhuma tarefa para este dia.</p>'
        return
    }

    lista.innerHTML = ''

    items.forEach((t, index) => {
        const div = document.createElement('div')
        div.className = 'modal-task' + (t.done ? ' done' : '')
        div.draggable = true
        div.dataset.index = index

        // Drag handle
        const handle = document.createElement('span')
        handle.className = 'drag-handle'
        handle.innerHTML = '⠿'
        handle.title = 'Arrastar para reordenar'

        // Check button
        const checkBtn = document.createElement('button')
        checkBtn.className = 'check-btn'
        checkBtn.textContent = '✓'
        checkBtn.onclick = () => toggleTarefa(k, t.id)

        // Texto (clicável para editar)
        const span = document.createElement('span')
        span.className = 'modal-task-text'
        span.textContent = t.texto
        span.title = 'Clique duas vezes para editar'
        span.ondblclick = () => iniciarEdicao(k, t.id, span)

        // Delete button
        const delBtn = document.createElement('button')
        delBtn.className = 'del-btn'
        delBtn.textContent = '×'
        delBtn.onclick = () => excluirTarefa(k, t.id)

        div.appendChild(handle)
        div.appendChild(checkBtn)
        div.appendChild(span)
        div.appendChild(delBtn)

        // Drag events
        div.addEventListener('dragstart', e => onDragStart(e, index, k))
        div.addEventListener('dragend',   e => onDragEnd(e))
        div.addEventListener('dragover',  e => onDragOver(e, index))
        div.addEventListener('dragleave', e => onDragLeave(e))
        div.addEventListener('drop',      e => onDrop(e, index, k))

        lista.appendChild(div)
    })
}

document.getElementById('taskInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') adicionarTarefaDia()
})

window.mudarMes = mudarMes
window.abrirModal = abrirModal
window.fecharModal = fecharModal
window.adicionarTarefaDia = adicionarTarefaDia
window.toggleTarefa = toggleTarefa
window.excluirTarefa = excluirTarefa

carregarTarefas()