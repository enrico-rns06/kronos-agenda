import { auth, db } from './firebase.js'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'
import { doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'

const sessao = localStorage.getItem('sessao')

if (!sessao) {
    window.location.href = 'login.html'
}

document.getElementById('nomeUsuario').textContent = 'Olá, ' + sessao + '!'

// Mudar senha
document.getElementById('mudarSenha').addEventListener('submit', async function(evento) {
    evento.preventDefault()

    const senhaAtual = document.getElementById('senhaAtual').value
    const novaSenha = document.getElementById('novaSenha').value
    const confirmarSenha = document.getElementById('confirmarSenha').value

    if (novaSenha !== confirmarSenha) {
        alert('A nova senha e a confirmação não coincidem')
        return
    }

    if (novaSenha.length < 6) {
        alert('A nova senha deve ter pelo menos 6 caracteres')
        return
    }

    try {
        const usuario = auth.currentUser
        const email = sessao + '@kronos.app'
        const credencial = EmailAuthProvider.credential(email, senhaAtual)

        await reauthenticateWithCredential(usuario, credencial)
        await updatePassword(usuario, novaSenha)

        alert('Senha atualizada com sucesso!')
        document.getElementById('senhaAtual').value = ''
        document.getElementById('novaSenha').value = ''
        document.getElementById('confirmarSenha').value = ''
    } catch (erro) {
        if (erro.code === 'auth/wrong-password' || erro.code === 'auth/invalid-credential') {
            alert('Senha atual incorreta')
        } else {
            alert('Erro ao atualizar senha: ' + erro.message)
        }
    }
})

// Apagar conta
document.getElementById('apagarConta').addEventListener('submit', async function(evento) {
    evento.preventDefault()

    const confirmar = confirm('Tem certeza que deseja apagar sua conta? Essa ação é irreversível.')
    if (!confirmar) return

    try {
        const usuario = auth.currentUser

        // Remover tarefas do Firestore
        await deleteDoc(doc(db, 'usuarios', sessao))

        // Apagar conta do Firebase Auth
        await deleteUser(usuario)

        // Limpar sessão
        localStorage.removeItem('sessao')

        alert('Conta apagada com sucesso.')
        window.location.href = 'login.html'
    } catch (erro) {
        if (erro.code === 'auth/requires-recent-login') {
            alert('Por segurança, faça login novamente antes de apagar a conta.')
            localStorage.removeItem('sessao')
            window.location.href = 'login.html'
        } else {
            alert('Erro ao apagar conta: ' + erro.message)
        }
    }
})