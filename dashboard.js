// Selección de pestañas y paneles del dashboard.
const roleTabs = document.querySelectorAll('.role-tab');
const rolePanels = document.querySelectorAll('.role-panel');
const sessionRole = document.getElementById('session-role');
const params = new URLSearchParams(window.location.search);
const storedRole = sessionStorage.getItem('socpymeRole');
const role = params.get('role') || storedRole || 'user';

// Texto legible que se muestra según el rol activo.
const roleLabels = {
    admin: 'Administrador del SOC',
    developer: 'Desarrollador del SOC',
    user: 'Usuario / Cliente'
};

const activeRole = roleLabels[role] ? role : 'user';
sessionStorage.setItem('socpymeRole', activeRole);

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

const sessionRoleCopy = document.getElementById('session-role-copy');
if (sessionRoleCopy) {
    sessionRoleCopy.textContent = roleLabels[activeRole] || 'Usuario / Cliente';
}

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
const heatmapButton = document.getElementById('btn-refresh-heatmap');
const heatCells = document.querySelectorAll('.heat-cell');
const heatCriticalCount = document.getElementById('heat-critical-count');
const heatGraveCount = document.getElementById('heat-grave-count');
const heatMildCount = document.getElementById('heat-mild-count');
const heatGlobalStatus = document.getElementById('heat-global-status');
const heatmapStatus = document.getElementById('heatmap-status');

const heatmapScenarios = [
    {
        label: 'Concentración crítica en el norte de Argentina y Latam',
        counts: { critical: 5, grave: 4, mild: 6 },
        zones: {
            'Argentina - Norte': { level: 'critical', alerts: 24, note: 'Aumento de phishing dirigido a proveedores locales' },
            'Argentina - Centro': { level: 'grave', alerts: 17, note: 'Tráfico anómalo en horarios fuera de negocio' },
            'Argentina - Sur': { level: 'mild', alerts: 7, note: 'Actividad contenida y estable' },
            'Cono Sur': { level: 'grave', alerts: 16, note: 'Alertas de credenciales reutilizadas' },
            'Latam': { level: 'critical', alerts: 29, note: 'Focos críticos de múltiples orígenes' },
            Global: { level: 'mild', alerts: 10, note: 'Monitoreo preventivo sin escalamiento' }
        }
    },
    {
        label: 'Escenario mixto con presión en el centro y Cono Sur',
        counts: { critical: 3, grave: 6, mild: 7 },
        zones: {
            'Argentina - Norte': { level: 'grave', alerts: 15, note: 'Campañas maliciosas moderadas' },
            'Argentina - Centro': { level: 'critical', alerts: 22, note: 'Picos de intentos de acceso a sistemas internos' },
            'Argentina - Sur': { level: 'mild', alerts: 8, note: 'Sin variaciones significativas' },
            'Cono Sur': { level: 'critical', alerts: 26, note: 'Ataques distribuidos detectados en cadena' },
            'Latam': { level: 'grave', alerts: 18, note: 'Incremento de alertas de severidad media' },
            Global: { level: 'mild', alerts: 11, note: 'Vigilancia normalizada' }
        }
    },
    {
        label: 'Entorno estabilizado con alertas leves predominantes',
        counts: { critical: 1, grave: 3, mild: 10 },
        zones: {
            'Argentina - Norte': { level: 'mild', alerts: 9, note: 'Actividad regular en servicios públicos' },
            'Argentina - Centro': { level: 'grave', alerts: 13, note: 'Eventos aislados en horas de cierre' },
            'Argentina - Sur': { level: 'mild', alerts: 5, note: 'Vigilancia sin anomalías mayores' },
            'Cono Sur': { level: 'mild', alerts: 8, note: 'Patrones estables' },
            'Latam': { level: 'grave', alerts: 14, note: 'Requiere seguimiento pero sin escalamiento' },
            Global: { level: 'critical', alerts: 19, note: 'Se detecta un pico puntual en frontera externa' }
        }
    }
];

function applyHeatmapScenario(scenario) {
    heatCells.forEach((cell) => {
        const zoneName = cell.dataset.zone;
        const zoneData = scenario.zones[zoneName];
        if (!zoneData) {
            return;
        }

        cell.classList.remove('critical', 'grave', 'mild');
        cell.classList.add(zoneData.level);
        cell.querySelector('strong').textContent = `${zoneData.alerts} alertas`;
        cell.querySelector('small').textContent = zoneData.note;
    });

    if (heatCriticalCount) {
        heatCriticalCount.textContent = scenario.counts.critical;
    }
    if (heatGraveCount) {
        heatGraveCount.textContent = scenario.counts.grave;
    }
    if (heatMildCount) {
        heatMildCount.textContent = scenario.counts.mild;
    }
    if (heatGlobalStatus) {
        heatGlobalStatus.textContent = scenario.label;
    }
    if (heatmapStatus) {
        heatmapStatus.textContent = `Mapa actualizado: ${scenario.label}.`;
    }
}

if (heatmapButton) {
    heatmapButton.addEventListener('click', () => {
        const scenario = heatmapScenarios[Math.floor(Math.random() * heatmapScenarios.length)];
        applyHeatmapScenario(scenario);
    });
}

if (heatmapStatus) {
    heatmapStatus.textContent = 'Monitoreo de calor activo para zonas y países.';
}

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
        // Simulación de generación de reporte con barra de progreso.
        pdfButton.disabled = true;
        let porcentaje = 0;

        const intervalo = setInterval(() => {
            porcentaje += 20;
            if (pdfStatus) {
                pdfStatus.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generando auditoría... ${porcentaje}%`;
            }

            if (porcentaje >= 100) {
                clearInterval(intervalo);
                if (pdfStatus) {
                    pdfStatus.innerHTML = `<span style="color: #10b981;"><i class="fa-solid fa-file-circle-check"></i> Reporte "SOC-Audit_PYME.pdf" descargado con éxito.</span>`;
                }
                pdfButton.disabled = false;
            }
        }, 400);
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
const btnToken = document.getElementById('btn-generate-token');
const tokenDisplay = document.getElementById('token-display');

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

if (btnToken && tokenDisplay) {
    btnToken.addEventListener('click', () => {
        // Genera una cadena aleatoria imitando un token JWT/Bearer.
        const randomToken = 'soc_live_' + Math.random().toString(16).substring(2, 15) + Math.random().toString(16).substring(2, 15);
        tokenDisplay.innerHTML = `
            <div style="background: rgba(0, 242, 254, 0.1); padding: 10px; border-left: 3px solid #00f2fe; border-radius: 4px;">
                <strong>Token generado:</strong><br>${randomToken}
                <br><small style="color: #64748b;">✔ Copiado al portapapeles (Simulado)</small>
            </div>
        `;
    });
}