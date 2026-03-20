document.getElementById('formCriar').addEventListener('submit',function(evento) { 
    evento.preventDefault()

const usuario = document.getElementById('criarUsuario').value
const senha = document.getElementById('criarSenha').value
const confirmar = document.getElementById('confirmarSenha').value

if (usuario == '') {
    alert('Digite um nome de usuário!')
    return
}

if (senha !== confirmar) {
    alert('As senhas não coincidem!')
    return
}

if (senha.length < 6) {
    alert('A senha deve ter ao menos 6 caracteres!')
    return
}

// Pega a lista de usuários já salva
const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')

// Verifisca se usuário já existe
const usuarioExiste = usuarios.find(u => u.usuario === usuario)

if (usuarioExiste) {
    alert('Esse usuario já existe')
    return
}

// Adiciona novo usuário ao sistema
usuarios.push({usuario: usuario, senha: senha})

// Salva a lista atualizada no LocalStorage
localStorage.setItem('usuarios', JSON.stringify(usuarios))

alert('Conta criada com sucesso')
window.location.href = 'login.html'

})