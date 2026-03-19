document.getElementById('formLogin').addEventListener('submit',function(evento) { 
    evento.preventDefault()

const usuario = document.getElementById('inputUsuario').value
const senha = document.getElementById('inputSenha').value
const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.senha === senha)

if (!usuarioEncontrado) {
    alert('Usuário ou senha incorretos!')
    return
}

localStorage.setItem('sessao', usuario)
window.location.href = 'index.html'

})