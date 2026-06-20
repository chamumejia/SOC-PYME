/*
    Script de autenticación.
    Controla el cambio entre login y registro, la validación y los estados de error.
*/

// Referencias a las secciones principales de la tarjeta de acceso.
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const linkToRegister = document.getElementById('link-to-register');
const linkToLogin = document.getElementById('link-to-login');
const errorBox = document.getElementById('error-message');

// Credenciales demo para la simulación del proyecto.
const demoUsers = {
    'admin@socpyme.com': {
        password: 'SocAdmin#2026',
        role: 'admin'
    },
    'dev@socpyme.com': {
        password: 'SocDev#2026',
        role: 'developer'
    },
    'usuario@socpyme.com': {
        password: 'SocUser#2026',
        role: 'user'
    }
};

// Control de seguridad anti-fuerza bruta.
let intentosFallidos = 0;

// Si se abre con action=register, mostramos directamente el formulario de registro.
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'register') {
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
    }
});

// Alterna la visibilidad de la contraseña para facilitar la escritura.
document.getElementById('btn-toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Cambia entre el modo de inicio de sesión y el de registro.
linkToRegister.addEventListener('click', function(e) {
    e.preventDefault();
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
    errorBox.style.display = 'none'; 
});

linkToLogin.addEventListener('click', function(e) {
    e.preventDefault();
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
});

// Valida las credenciales demo e imita un retraso de procesamiento.
document.getElementById('form-login').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('username').value.trim().toLowerCase();
    const clave = document.getElementById('password').value;
    const btnSubmit = this.querySelector('.btn-login-submit');
    const btnText = document.getElementById('btn-text');
    
    // Deshabilitamos el botón mientras la validación está en curso.
    btnSubmit.disabled = true;
    btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando credenciales...';
    errorBox.style.display = 'none';

    setTimeout(() => {
        const usuarioDemo = demoUsers[usuario];

        if (usuarioDemo && usuarioDemo.password === clave) {
            intentosFallidos = 0;
            btnText.innerText = "Acceso Concedido...";
            
            setTimeout(() => {
                window.location.href = `dashboard.html?role=${usuarioDemo.role}&user=${encodeURIComponent(usuario)}`; 
            }, 500);
            
        } else {
            intentosFallidos++;
            btnSubmit.disabled = false;
            btnText.innerHTML = 'Autenticar Sistema <i class="fa-solid fa-key"></i>';
            
            if (intentosFallidos >= 3) {
                // Bloqueo temporal del acceso después de varios intentos fallidos.
                errorBox.innerHTML = '<i class="fa-solid fa-ban"></i> Sistema bloqueado temporalmente (3 intentos fallidos).';
                errorBox.style.display = 'flex';
                btnSubmit.disabled = true;
                btnSubmit.style.opacity = "0.5";
                
                setTimeout(() => {
                    intentosFallidos = 0;
                    btnSubmit.disabled = false;
                    btnSubmit.style.opacity = "1";
                    errorBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Credenciales incorrectas (usa una de las cuentas de prueba).';
                    errorBox.style.display = 'none';
                }, 10000); // Se desbloquea automáticamente después de 10 segundos.
            } else {
                errorBox.style.display = 'flex';
            }
        }
    }, 1200); // Tiempo de carga simulado.
});

// Simula el alta de una nueva empresa dentro del sistema.
document.getElementById('form-register').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombreEmpresa = document.getElementById('reg-company').value;
    const btnSubmit = this.querySelector('.btn-login-submit');
    const btnSpan = btnSubmit.querySelector('span');

    btnSubmit.disabled = true;
    btnSpan.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registrando en Servidor...';

    setTimeout(() => {
        alert(`¡Infraestructura registrada con éxito para la empresa: ${nombreEmpresa}!\nYa puedes iniciar sesión en el panel.`);
        
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
        btnSubmit.disabled = false;
        btnSpan.innerText = 'Registrar Infraestructura';
        this.reset();
    }, 1500);
});