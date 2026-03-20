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
let tarefas = JSON.parse(localStorage.getItem('tarefas-' + sessao) || '{}')

function chave(ano, mes, dia) {
    return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
}

function salvar() {
    localStorage.setItem('tarefas-' + sessao, JSON.stringify(tarefas))
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
renderizarCalendario()


function mudarMes (direcao) {
    mesAtual += direcao
    if (mesAtual > 11) {mesAtual = 0; anoAtual++}
    if (mesAtual < 0) {mesAtual = 11; anoAtual--}
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

function adicionarTarefaDia() {
    if (!diaSelecionado) return
    const input = document.getElementById('taskInput')
    const texto = input.value.trim()
    if (!texto) return

    const k = chave(anoAtual, mesAtual, diaSelecionado)
    if (!tarefas[k]) tarefas[k] = []
    tarefas[k].push({ id: Date.now(), texto, done: false })
    salvar()
    renderizarModalTarefas(k)
    input.value = ''
    input.focus()
}

function toggleTarefa(k, id) {
    const t = (tarefas[k] || []).find(t => t.id === id)
    if (t) {
        t.done = !t.done
        salvar()
        renderizarModalTarefas(k)
    }
}

function excluirTarefa(k, id) {
    tarefas[k] = (tarefas[k] || []).filter(t => t.id !== id)
    salvar()
    renderizarModalTarefas(k)
}

function renderizarModalTarefas(k) {
    const lista = document.getElementById('modalTasks')
    const items = tarefas[k] || []

    if (items.length === 0) {
        lista.innerHTML = '<p class="empty-modal">Nenhuma tarefa para este dia.</p>'
        return
    }

    lista.innerHTML = items.map (t => `
        <div class="modal-task ${t.done ? 'done' : ''}">
            <button class="check-btn" onclick="toggleTarefa('${k}', ${t.id})">✓</button>
            <span class="modal-task-text">${t.texto}</span>
            <button class="del-btn" onclick="excluirTarefa('${k}', ${t.id})">×</button>
        </div>
    `).join('')
}

const taskInput = document.getElementById("taskInput");

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        adicionarTarefaDia();
    }
});