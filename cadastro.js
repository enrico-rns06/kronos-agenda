import { auth } from './firebase.js'
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'

document.getElementById('formCriar').addEventListener('submit', async function(evento) {
    evento.preventDefault()

    const usuario = document.getElementById('criarUsuario').value.trim()
    const senha = document.getElementById('criarSenha').value
    const confirmar = document.getElementById('confirmarSenha').value

    if (!usuario) {
        alert('Digite um nome de usuário!')
        return
    }

    if (senha !== confirmar) {
        alert('As senhas não coincidem!')
        return
    }

    if (senha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres!')
        return
    }

    try {
        const email = usuario + '@kronos.app'
        await createUserWithEmailAndPassword(auth, email, senha)
        alert('Conta criada com sucesso!')
        window.location.href = 'login.html'
    } catch (erro) {
        if (erro.code === 'auth/email-already-in-use') {
            alert('Esse usuário já existe!')
        } else {
            alert('Erro ao criar conta: ' + erro.message)
        }
    }
})