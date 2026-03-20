import { auth } from './firebase.js'
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'

document.getElementById('formLogin').addEventListener('submit', async function(evento) {
    evento.preventDefault()

    const usuario = document.getElementById('inputUsuario').value.trim()
    const senha = document.getElementById('inputSenha').value

    if (!usuario) {
        alert('Digite o nome de usuário!')
        return
    }

    try {
        const email = usuario + '@kronos.app'
        await signInWithEmailAndPassword(auth, email, senha)
        localStorage.setItem('sessao', usuario)
        window.location.href = 'index.html'
    } catch (erro) {
        alert('Usuário ou senha incorretos!')
    }
})