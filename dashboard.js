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
const worldMap = document.getElementById('world-heatmap');
const mapRegionName = document.getElementById('map-region-name');
const mapRegionScore = document.getElementById('map-region-score');
const mapRegionNote = document.getElementById('map-region-note');
const mapRegionSeverity = document.getElementById('map-region-severity');
const mapRegionRecommendation = document.getElementById('map-region-recommendation');

const heatmapScenarios = [
    {
        label: 'Concentración crítica en Norteamérica, Europa y Asia Pacifico',
        counts: { critical: 5, grave: 4, mild: 6 },
        zones: {
            'North America': { level: 'critical', alerts: 24, note: 'Pico de phishing y movimientos laterales en cadenas corporativas', severity: 'Crítica', recommendation: 'Aislar accesos remotos y reforzar MFA' },
            'South America': { level: 'grave', alerts: 17, note: 'Incremento de malware bancario y credenciales reutilizadas', severity: 'Grave', recommendation: 'Elevar monitoreo de endpoints y correo' },
            Europe: { level: 'mild', alerts: 7, note: 'Actividad controlada con campañas de bajo volumen', severity: 'Leve', recommendation: 'Mantener reglas preventivas' },
            'Middle East': { level: 'grave', alerts: 16, note: 'Intentos de acceso y barridos automatizados', severity: 'Grave', recommendation: 'Revisar bloqueos geográficos' },
            'Asia Pacific': { level: 'critical', alerts: 29, note: 'Mayor concentración de incidentes críticos en cadena', severity: 'Crítica', recommendation: 'Priorizar contención regional' },
            Australia: { level: 'mild', alerts: 10, note: 'Monitoreo preventivo sin escalamiento', severity: 'Leve', recommendation: 'Seguimiento normal' },
            Global: { level: 'mild', alerts: 12, note: 'Cobertura mundial con vigilancia sostenida', severity: 'Leve', recommendation: 'Mantener visibilidad global' }
        }
    },
    {
        label: 'Escenario mixto con presión en Europa y Norteamérica',
        counts: { critical: 3, grave: 6, mild: 7 },
        zones: {
            'North America': { level: 'grave', alerts: 15, note: 'Campañas maliciosas moderadas y exploración de servicios', severity: 'Grave', recommendation: 'Aumentar filtrado y respuesta temprana' },
            'South America': { level: 'mild', alerts: 8, note: 'Sin variaciones significativas', severity: 'Leve', recommendation: 'Mantener vigilancia estándar' },
            Europe: { level: 'critical', alerts: 22, note: 'Picos de intentos de acceso a sistemas internos', severity: 'Crítica', recommendation: 'Priorizar aislamiento y validación de identidad' },
            'Middle East': { level: 'critical', alerts: 26, note: 'Ataques distribuidos detectados en cadena', severity: 'Crítica', recommendation: 'Escalar a contención activa' },
            'Asia Pacific': { level: 'grave', alerts: 18, note: 'Incremento de alertas de severidad media', severity: 'Grave', recommendation: 'Revisar patrones de entrada' },
            Australia: { level: 'mild', alerts: 11, note: 'Vigilancia normalizada', severity: 'Leve', recommendation: 'Sin acciones adicionales' },
            Global: { level: 'mild', alerts: 13, note: 'Cobertura estable con eventos aislados', severity: 'Leve', recommendation: 'Seguimiento continuo' }
        }
    },
    {
        label: 'Entorno estabilizado con alertas leves predominantes',
        counts: { critical: 1, grave: 3, mild: 10 },
        zones: {
            'North America': { level: 'mild', alerts: 9, note: 'Actividad regular con eventos aislados', severity: 'Leve', recommendation: 'Continuar observación pasiva' },
            'South America': { level: 'grave', alerts: 13, note: 'Eventos aislados en ventanas fuera de horario', severity: 'Grave', recommendation: 'Revisar cuentas sensibles' },
            Europe: { level: 'mild', alerts: 5, note: 'Vigilancia sin anomalías mayores', severity: 'Leve', recommendation: 'Mantener operación normal' },
            'Middle East': { level: 'mild', alerts: 8, note: 'Patrones estables', severity: 'Leve', recommendation: 'Sin acciones adicionales' },
            'Asia Pacific': { level: 'grave', alerts: 14, note: 'Requiere seguimiento pero sin escalamiento', severity: 'Grave', recommendation: 'Validar accesos regionales' },
            Australia: { level: 'critical', alerts: 19, note: 'Pico puntual en frontera externa', severity: 'Crítica', recommendation: 'Inspección inmediata de tráfico' },
            Global: { level: 'mild', alerts: 12, note: 'Monitoreo global equilibrado', severity: 'Leve', recommendation: 'Mantener visibilidad' }
        }
    }
];

const worldMapFallbacks = {
    'North America': { path: 'M80 145 L145 110 L225 118 L282 155 L262 208 L200 224 L154 206 L114 232 L74 205 L52 168 Z', label: 'North America' },
    'South America': { path: 'M304 266 L348 280 L372 330 L360 387 L334 449 L305 487 L283 459 L291 399 L276 337 Z', label: 'South America' },
    Europe: { path: 'M505 130 L548 114 L592 121 L606 151 L572 171 L528 165 L501 148 Z', label: 'Europe' },
    Africa: { path: 'M512 185 L577 192 L621 250 L602 330 L556 400 L494 384 L474 304 L491 227 Z', label: 'Africa' },
    'Middle East': { path: 'M603 187 L648 181 L684 204 L670 234 L630 238 L610 214 Z', label: 'Middle East' },
    'Asia Pacific': { path: 'M686 116 L788 94 L915 116 L1038 162 L1044 220 L972 250 L903 233 L853 195 L789 202 L732 184 L683 149 Z', label: 'Asia Pacific' },
    Australia: { path: 'M918 386 L990 372 L1039 400 L1028 448 L967 462 L915 433 Z', label: 'Australia' },
    Global: { path: 'M80 520 L200 508 L340 520 L490 514 L640 525 L800 516 L965 522 L1120 514 L1120 584 L80 584 Z', label: 'Global' }
};

let activeWorldRegion = 'North America';

function applyHeatmapScenario(scenario) {
    const regionNodes = worldMap ? worldMap.querySelectorAll('.continent') : [];
    regionNodes.forEach((regionNode) => {
        const zoneName = regionNode.dataset.region;
        const zoneData = scenario.zones[zoneName];
        if (!zoneData) {
            return;
        }

        regionNode.classList.remove('critical', 'grave', 'mild', 'active');
        regionNode.classList.add(zoneData.level);
        if (zoneName === activeWorldRegion) {
            regionNode.classList.add('active');
        }
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

    updateWorldDetail(activeWorldRegion, scenario);
}

function updateWorldDetail(regionName, scenario) {
    const zoneData = scenario.zones[regionName] || scenario.zones.Global;
    if (mapRegionName) {
        mapRegionName.textContent = regionName;
    }
    if (mapRegionScore) {
        mapRegionScore.textContent = `${zoneData.alerts} alertas`;
    }
    if (mapRegionNote) {
        mapRegionNote.textContent = zoneData.note;
    }
    if (mapRegionSeverity) {
        mapRegionSeverity.textContent = zoneData.severity;
    }
    if (mapRegionRecommendation) {
        mapRegionRecommendation.textContent = zoneData.recommendation;
    }
}

function highlightWorldRegion(regionName) {
    activeWorldRegion = regionName;
    const regionNode = worldMap ? worldMap.querySelector(`[data-region="${regionName}"]`) : null;
    if (!regionNode) {
        return;
    }

    const currentScenario = heatmapScenarios.find((scenario) => scenario.zones[regionName]) || heatmapScenarios[0];
    updateWorldDetail(regionName, currentScenario);
    if (heatmapStatus) {
        heatmapStatus.textContent = `Región seleccionada: ${regionName}.`;
    }
    worldMap.querySelectorAll('.continent').forEach((node) => node.classList.toggle('active', node.dataset.region === regionName));
}

if (heatmapButton) {
    heatmapButton.addEventListener('click', () => {
        const scenario = heatmapScenarios[Math.floor(Math.random() * heatmapScenarios.length)];
        applyHeatmapScenario(scenario);
    });
}

if (worldMap) {
    worldMap.querySelectorAll('.continent').forEach((regionNode) => {
        regionNode.addEventListener('click', () => highlightWorldRegion(regionNode.dataset.region));
        regionNode.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                highlightWorldRegion(regionNode.dataset.region);
            }
        });
    });
}

if (heatmapStatus) {
    heatmapStatus.textContent = 'Mapa mundial activo. Haz clic en una región para ver su severidad.';
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

if (worldMap) {
    applyHeatmapScenario(heatmapScenarios[0]);
    highlightWorldRegion('North America');
}