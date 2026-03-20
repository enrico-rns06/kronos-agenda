// Sessão
const sessao = localStorage.getItem('sessao')

if (!sessao) {
    window.location.href = 'login.html'
}

// Mostrar nome
document.getElementById('nomeUsuario').textContent = 'Olá, ' + sessao + '!'


// Mudar senha
document.getElementById('mudarSenha').addEventListener('submit', function (evento) {
    evento.preventDefault()

    const senhaAtual = document.getElementById('senhaAtual').value
    const novaSenha = document.getElementById('novaSenha').value
    const confirmarSenha = document.getElementById('confirmarSenha').value

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || []

    const usuario = usuarios.find(u => u.usuario === sessao)

    if (!usuario) {
        alert('Usuário não encontrado')
        return
    }

    if (usuario.senha !== senhaAtual) {
        alert('Senha atual incorreta')
        return
    }

    if (novaSenha !== confirmarSenha) {
        alert('A nova senha e a confirmação não coincidem')
        return
    }

    if (novaSenha.length < 6) {
        alert('A nova senha deve ter pelo menos 6 caracteres')
        return
    }

    // Atualizar senha
    usuario.senha = novaSenha

    localStorage.setItem('usuarios', JSON.stringify(usuarios))

    alert('Senha atualizada com sucesso!')
})


// Apagar conta
document.getElementById('apagarConta').addEventListener('submit', function (evento) {
    evento.preventDefault()

    const confirmar = confirm('Tem certeza que deseja apagar sua conta?')

    if (!confirmar) return

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || []

    // Remover usuario
    usuarios = usuarios.filter(u => u.usuario !== sessao)
    localStorage.setItem('usuarios', JSON.stringify(usuarios))

    // Remover tarefas
    localStorage.removeItem('tarefas-' + sessao)

    // Remover sessao
    localStorage.removeItem('sessao')

    // Redirecionar
    window.location.href = 'login.html'
})