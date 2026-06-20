// Selección de pestañas y paneles del dashboard.
const roleTabs = document.querySelectorAll('.role-tab');
const rolePanels = document.querySelectorAll('.role-panel');
const sessionRole = document.getElementById('session-role');
const params = new URLSearchParams(window.location.search);
const role = params.get('role') || 'user';

// Texto legible que se muestra según el rol activo.
const roleLabels = {
    admin: 'Administrador del SOC',
    developer: 'Desarrollador del SOC',
    user: 'Usuario / Cliente'
};

const activeRole = roleLabels[role] ? role : 'user';

// Muestra únicamente el panel que corresponde al rol elegido.
function showRolePanel(targetRole) {
    rolePanels.forEach((panel) => {
        panel.classList.toggle('active', panel.id === targetRole);
    });

    roleTabs.forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.roleTarget === targetRole);
    });
}

showRolePanel(`${activeRole}-panel`);
sessionRole.textContent = roleLabels[activeRole] || 'Sesión activa';

// Cambio de pestañas del panel principal.
roleTabs.forEach((tab) => {
    tab.addEventListener('click', () => showRolePanel(tab.dataset.roleTarget));
});

// Controles del panel de administrador.
const isolateButton = document.getElementById('btn-isolate-server');
const serverDevice = document.querySelector('[data-device="Servidor ERP"]');
const threatLevel = document.getElementById('threat-level');
const pdfButton = document.getElementById('btn-pdf-report');
const pdfStatus = document.getElementById('pdf-status');
const adminStatus = document.getElementById('admin-status');

if (isolateButton && serverDevice) {
    isolateButton.addEventListener('click', () => {
        // Marca el dispositivo como aislado y actualiza el estado visual.
        serverDevice.classList.add('isolated');
        const status = serverDevice.querySelector('span');
        if (status) {
            status.textContent = 'Aislado por Seguridad';
        }
        if (threatLevel) {
            threatLevel.textContent = 'Bajo';
        }
        if (adminStatus) {
            adminStatus.textContent = 'Servidor aislado correctamente. La amenaza quedó contenida.';
        }
    });
}

if (pdfButton) {
    pdfButton.addEventListener('click', () => {
        // Simulación de generación de reporte para el administrador.
        pdfStatus.textContent = 'Generando reporte PDF...';
        pdfButton.disabled = true;
        setTimeout(() => {
            pdfStatus.textContent = 'Reporte listo. Simulación de descarga completada.';
            pdfButton.disabled = false;
        }, 1600);
    });
}

const scanButton = document.getElementById('btn-scan-pc');
const scanProgress = document.getElementById('scan-progress');
const scanMessage = document.getElementById('scan-message');
const incidentForm = document.getElementById('incident-form');
const incidentText = document.getElementById('incident-text');
const incidentStatus = document.getElementById('incident-status');

if (scanButton && scanProgress && scanMessage) {
    scanButton.addEventListener('click', () => {
        // Simulación de análisis local con barra de progreso.
        scanButton.disabled = true;
        let progress = 0;
        scanMessage.textContent = 'Ejecutando análisis local...';

        const timer = setInterval(() => {
            progress += 10;
            scanProgress.style.width = `${progress}%`;

            if (progress >= 100) {
                clearInterval(timer);
                scanMessage.textContent = 'Análisis completado en tu red local. 0 amenazas detectadas hoy';
                scanButton.disabled = false;
                setTimeout(() => {
                    scanProgress.style.width = '0%';
                }, 1400);
            }
        }, 180);
    });
}

if (incidentForm && incidentText && incidentStatus) {
    incidentForm.addEventListener('submit', (event) => {
        // El usuario envía un reporte de incidente al SOC.
        event.preventDefault();
        const message = incidentText.value.trim() || 'Me llegó un correo raro';
        incidentStatus.textContent = `Reporte enviado al SOC: ${message}`;
        incidentText.value = '';
    });
}

// Controles de telemetría y modo de depuración del desarrollador.
const updateButton = document.getElementById('btn-update-virus-db');
const updateProgress = document.getElementById('update-progress');
const updateMessage = document.getElementById('update-message');
const debugToggle = document.getElementById('debug-toggle');
const debugOutput = document.getElementById('debug-output');

if (updateButton && updateProgress && updateMessage) {
    updateButton.addEventListener('click', () => {
        // Simula la descarga e instalación de nuevas firmas de malware.
        updateButton.disabled = true;
        updateMessage.textContent = 'Descargando paquetes de firmas...';
        let progress = 0;

        const timer = setInterval(() => {
            progress += 8;
            updateProgress.style.width = `${progress}%`;

            if (progress >= 100) {
                clearInterval(timer);
                updateMessage.textContent = '[KERNEL] Parches de firmas de malware actualizados a v2.4.1';
                console.log('[KERNEL] Parches de firmas de malware actualizados a v2.4.1');
                if (debugOutput) {
                    const line = document.createElement('p');
                    line.textContent = '[KERNEL] Parches de firmas de malware actualizados a v2.4.1';
                    debugOutput.appendChild(line);
                }
                updateButton.disabled = false;
                setTimeout(() => {
                    updateProgress.style.width = '0%';
                }, 1800);
            }
        }, 240);
    });
}

if (debugToggle && debugOutput) {
    debugToggle.addEventListener('change', () => {
        // Muestra u oculta la salida técnica adicional del panel.
        debugOutput.classList.toggle('debug-on', debugToggle.checked);
        console.log(debugToggle.checked ? '[DEBUG] Modo de depuración activado' : '[DEBUG] Modo de depuración desactivado');
    });
}