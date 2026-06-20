/*
    Script principal de la página de inicio.
    Maneja el menú móvil y el simulador de alertas SOC.
*/

// Alertas reutilizables para construir la simulación visual del SOC.
const bancoAlertas = [
    { tipo: 'danger', texto: '[CRÍTICO] Intento de inyección SQL detectado en el formulario corporativo.' },
    { tipo: 'warning', texto: '[ALERTA] Escaneo de puertos masivo UDP desde IP externa anónima.' },
    { tipo: 'danger', texto: '[CRÍTICO] Ataque de Ransomware interceptado en el Endpoint del usuario "Finanzas".' },
    { tipo: 'warning', texto: '[ALERTA] Múltiples intentos de acceso fallidos vía SSH al servidor principal.' },
    { tipo: 'danger', texto: '[CRÍTICO] Detección de malware intentando exfiltrar información confidencial.' },
    { tipo: 'success', texto: '[INFO] Parche de seguridad perimetral desplegado automáticamente en la red.' }
];

// Contador visible de ataques bloqueados en la interfaz.
let ataquesBloqueados = 142;

// Referencias al menú principal para abrirlo y cerrarlo en móvil.
const navToggle = document.getElementById('nav-toggle');
const header = document.querySelector('header');
const primaryNavigation = document.getElementById('primary-navigation');

if (navToggle && header && primaryNavigation) {
    const closeMenu = () => {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
        const isOpen = header.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    primaryNavigation.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });
}

// Genera una secuencia falsa de alertas para simular respuesta de seguridad.
document.getElementById('btn-generar-alerta').addEventListener('click', function() {
    const terminal = document.getElementById('terminal-logs');
    
    // Elegimos dos alertas aleatorias para que la simulación no se vea repetitiva.
    const alertaAleatoria1 = bancoAlertas[Math.floor(Math.random() * bancoAlertas.length)];
    const alertaAleatoria2 = bancoAlertas[Math.floor(Math.random() * bancoAlertas.length)];

    const simulacionLogs = [
        { tipo: 'system', texto: '[SOC-CORE] Analizando patrones de tráfico entrante...' },
        alertaAleatoria1,
        { tipo: 'system', texto: '[SOC-CORE] Implementando regla de aislamiento y bloqueo en el Firewall...' },
        alertaAleatoria2,
        { tipo: 'success', texto: '[ÉXITO] Amenazas mitigadas correctamente. Estado de la PYME: SEGURO.' }
    ];

    this.disabled = true;
    this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mitigando amenaza...';

    // Imprime una línea por segundo para simular un flujo de eventos real.
    let i = 0;
    
    function imprimirSiguienteLog() {
        if (i < simulacionLogs.length) {
            const p = document.createElement('p');
            p.className = `log ${simulacionLogs[i].tipo}`;
            p.innerText = simulacionLogs[i].texto;
            
            terminal.appendChild(p);
            terminal.scrollTop = terminal.scrollHeight;
            
            // Si la simulación terminó bien, actualizamos el total de ataques bloqueados.
            if (simulacionLogs[i].tipo === 'success') {
                ataquesBloqueados++;
                const contadorElemento = document.getElementById('contador-ataques');
                if (contadorElemento) {
                    contadorElemento.innerText = ataquesBloqueados;
                }
            }
            
            i++;
            setTimeout(imprimirSiguienteLog, 1000);
        } else {
            const btn = document.getElementById('btn-generar-alerta');
            btn.disabled = false;
            btn.innerText = "Simular Intento de Ataque";
        }
    }

    imprimirSiguienteLog();
});