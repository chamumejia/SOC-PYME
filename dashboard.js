// Capa visual adicional para el mapa mundial del SOC.
(function loadHeatmapStyles() {
    if (!document.querySelector('link[href="dashboard-heatmap.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'dashboard-heatmap.css';
        document.head.appendChild(link);
    }
})();

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
const heatCriticalCount = document.getElementById('heat-critical-count');
const heatGraveCount = document.getElementById('heat-grave-count');
const heatMildCount = document.getElementById('heat-mild-count');
const heatGlobalStatus = document.getElementById('heat-global-status');
const heatmapStatus = document.getElementById('heatmap-status');
const worldMap = document.getElementById('world-heatmap');
const mapDetailCard = document.querySelector('.map-detail-card');
const mapRegionName = document.getElementById('map-region-name');
const mapRegionScore = document.getElementById('map-region-score');
const mapRegionNote = document.getElementById('map-region-note');
const mapRegionSeverity = document.getElementById('map-region-severity');
const mapRegionRecommendation = document.getElementById('map-region-recommendation');

const svgNamespace = 'http://www.w3.org/2000/svg';

const severityWeight = {
    critical: 3,
    grave: 2,
    mild: 1
};

const severityLabels = {
    critical: 'Crítica',
    grave: 'Grave',
    mild: 'Leve'
};

const regionCoordinates = {
    'North America': { x: 170, y: 178, labelX: 165, labelY: 88 },
    'South America': { x: 330, y: 370, labelX: 337, labelY: 520 },
    Europe: { x: 548, y: 150, labelX: 548, labelY: 98 },
    Africa: { x: 560, y: 305, labelX: 560, labelY: 450 },
    'Middle East': { x: 652, y: 218, labelX: 674, labelY: 274 },
    'Asia Pacific': { x: 880, y: 190, labelX: 890, labelY: 84 },
    Australia: { x: 975, y: 420, labelX: 980, labelY: 500 },
    Global: { x: 600, y: 548, labelX: 602, labelY: 570 }
};

const worldLandPaths = [
    'M82 165 C113 132 153 117 194 116 C229 117 262 130 292 152 C315 170 336 194 329 216 C322 237 293 239 270 232 C245 225 229 229 211 242 C194 254 168 253 145 239 C124 226 109 231 88 216 C66 199 60 183 82 165 Z',
    'M125 102 C157 75 205 72 252 86 C278 95 301 112 298 132 C294 153 260 150 235 145 C208 140 184 145 160 158 C139 169 109 163 98 145 C88 129 101 113 125 102 Z',
    'M329 244 C358 247 381 263 391 290 C402 320 389 352 371 375 C356 395 350 423 340 449 C329 481 311 511 291 498 C272 485 280 451 284 423 C288 395 274 370 270 342 C265 309 277 278 302 257 C311 250 319 246 329 244 Z',
    'M488 125 C514 107 553 103 587 114 C611 121 630 137 626 154 C622 172 593 174 571 169 C547 164 526 172 503 164 C480 156 470 139 488 125 Z',
    'M500 196 C527 178 570 180 603 201 C632 219 652 253 648 289 C644 329 613 361 593 395 C578 421 552 439 527 424 C499 407 492 372 478 340 C465 310 459 275 469 243 C475 221 484 207 500 196 Z',
    'M612 184 C649 170 690 172 725 191 C749 204 756 224 740 239 C719 258 690 249 664 242 C641 236 615 226 604 207 C599 198 601 189 612 184 Z',
    'M670 130 C724 94 798 88 869 105 C930 119 997 135 1047 168 C1081 190 1105 226 1087 252 C1069 278 1018 270 979 260 C940 250 909 225 872 212 C832 198 789 210 751 199 C714 188 676 171 670 130 Z',
    'M794 248 C832 230 884 236 928 250 C970 264 1025 262 1064 290 C1105 321 1083 356 1033 362 C988 367 952 342 915 322 C883 304 830 313 802 288 C787 274 781 259 794 248 Z',
    'M908 388 C942 369 994 367 1031 391 C1065 413 1057 447 1019 462 C982 476 933 461 905 435 C887 419 887 400 908 388 Z',
    'M64 515 C191 502 319 515 448 512 C578 509 711 525 839 517 C951 510 1041 506 1132 516 L1132 586 L64 586 Z',
    'M442 73 C472 58 510 61 532 82 C504 91 471 94 442 73 Z',
    'M1078 318 C1104 314 1135 321 1154 342 C1130 350 1092 344 1078 318 Z',
    'M250 214 C278 213 302 224 318 244 C290 249 261 241 250 214 Z',
    'M743 278 C770 270 802 277 824 296 C796 302 763 297 743 278 Z'
];

const worldBorderPaths = [
    'M170 126 C181 158 177 196 150 235',
    'M248 132 C236 161 235 198 270 232',
    'M326 252 C333 308 332 377 303 493',
    'M548 116 C545 139 548 158 571 169',
    'M548 185 C548 250 547 328 527 424',
    'M503 242 C554 254 604 252 648 289',
    'M724 191 C787 188 847 198 915 226',
    'M882 104 C846 143 838 178 872 212',
    'M928 250 C944 285 955 324 1019 362',
    'M949 381 C957 411 973 442 1019 462'
];

const heatmapScenarios = [
    {
        label: 'Presión crítica sobre Norteamérica y Asia Pacífico',
        counts: { critical: 2, grave: 3, mild: 2 },
        zones: {
            'North America': { level: 'critical', alerts: 31, note: 'Pico de phishing ejecutivo, movimiento lateral y abuso de accesos remotos.', recommendation: 'Reforzar MFA y aislar sesiones sospechosas' },
            'South America': { level: 'grave', alerts: 17, note: 'Malware bancario y credenciales reutilizadas contra servicios expuestos.', recommendation: 'Elevar monitoreo de endpoints y correo' },
            Europe: { level: 'mild', alerts: 8, note: 'Campañas de bajo volumen contenidas por reglas preventivas.', recommendation: 'Mantener reglas actuales' },
            Africa: { level: 'mild', alerts: 6, note: 'Eventos aislados sin escalamiento operativo.', recommendation: 'Seguimiento estándar' },
            'Middle East': { level: 'grave', alerts: 19, note: 'Barridos automatizados y accesos fallidos a infraestructura pública.', recommendation: 'Revisar bloqueos geográficos' },
            'Asia Pacific': { level: 'critical', alerts: 34, note: 'Mayor concentración de incidentes críticos en cadena de suministro.', recommendation: 'Priorizar contención regional' },
            Australia: { level: 'grave', alerts: 15, note: 'Picos puntuales contra frontera externa y VPN.', recommendation: 'Inspeccionar tráfico entrante' },
            Global: { level: 'grave', alerts: 130, note: 'Cobertura mundial con dos regiones en estado crítico.', recommendation: 'Priorizar focos rojos' }
        }
    },
    {
        label: 'Europa y Medio Oriente requieren atención inmediata',
        counts: { critical: 2, grave: 4, mild: 1 },
        zones: {
            'North America': { level: 'grave', alerts: 18, note: 'Exploración de servicios corporativos y ataques de contraseña.', recommendation: 'Aumentar filtrado y respuesta temprana' },
            'South America': { level: 'mild', alerts: 9, note: 'Actividad estable con eventos de correo controlados.', recommendation: 'Mantener vigilancia estándar' },
            Europe: { level: 'critical', alerts: 29, note: 'Picos de intentos de acceso a sistemas internos y paneles administrativos.', recommendation: 'Validar identidad y aislar cuentas de alto riesgo' },
            Africa: { level: 'grave', alerts: 14, note: 'Incremento de tráfico anómalo hacia servicios web.', recommendation: 'Revisar reglas WAF' },
            'Middle East': { level: 'critical', alerts: 32, note: 'Ataques distribuidos detectados en cadena y actividad persistente.', recommendation: 'Escalar a contención activa' },
            'Asia Pacific': { level: 'grave', alerts: 21, note: 'Incremento de alertas de severidad media en nube pública.', recommendation: 'Revisar patrones de entrada' },
            Australia: { level: 'grave', alerts: 16, note: 'Actividad elevada pero contenida en perímetro.', recommendation: 'Mantener vigilancia reforzada' },
            Global: { level: 'grave', alerts: 139, note: 'Escenario mixto con dos zonas críticas y varias graves.', recommendation: 'Coordinar respuesta por prioridad' }
        }
    },
    {
        label: 'Entorno global estabilizado con un foco puntual',
        counts: { critical: 1, grave: 2, mild: 4 },
        zones: {
            'North America': { level: 'mild', alerts: 10, note: 'Actividad regular con eventos aislados.', recommendation: 'Continuar observación pasiva' },
            'South America': { level: 'grave', alerts: 16, note: 'Eventos fuera de horario sobre cuentas sensibles.', recommendation: 'Revisar privilegios y sesiones' },
            Europe: { level: 'mild', alerts: 7, note: 'Vigilancia sin anomalías mayores.', recommendation: 'Mantener operación normal' },
            Africa: { level: 'mild', alerts: 5, note: 'Patrones estables y baja exposición.', recommendation: 'Seguimiento normal' },
            'Middle East': { level: 'mild', alerts: 8, note: 'Intentos dispersos sin progresión.', recommendation: 'Sin acciones adicionales' },
            'Asia Pacific': { level: 'grave', alerts: 18, note: 'Alertas medias que requieren seguimiento.', recommendation: 'Validar accesos regionales' },
            Australia: { level: 'critical', alerts: 24, note: 'Pico puntual en frontera externa con señales de automatización.', recommendation: 'Inspección inmediata de tráfico' },
            Global: { level: 'mild', alerts: 88, note: 'Monitoreo global equilibrado con un foco prioritario.', recommendation: 'Atender el foco crítico' }
        }
    }
];

let activeWorldRegion = 'North America';
let currentHeatmapScenario = heatmapScenarios[0];

function createSvgElement(tagName, attributes = {}) {
    const element = document.createElementNS(svgNamespace, tagName);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
}

function ensureRealWorldMap() {
    if (!worldMap || worldMap.querySelector('.real-world-silhouette')) {
        return;
    }

    const silhouette = createSvgElement('g', { class: 'real-world-silhouette', 'aria-hidden': 'true' });
    worldLandPaths.forEach((pathData) => {
        silhouette.appendChild(createSvgElement('path', { d: pathData }));
    });

    const borders = createSvgElement('g', { class: 'real-world-borders', 'aria-hidden': 'true' });
    worldBorderPaths.forEach((pathData) => {
        borders.appendChild(createSvgElement('path', { d: pathData }));
    });

    const heatCore = createSvgElement('g', { class: 'map-heat-core', 'aria-hidden': 'true' });
    for (let index = 0; index < 5; index++) {
        heatCore.appendChild(createSvgElement('circle', { cx: 0, cy: 0, r: 0 }));
    }

    const focusRing = createSvgElement('g', { class: 'map-focus-ring', 'aria-hidden': 'true' });
    focusRing.appendChild(createSvgElement('circle', { cx: regionCoordinates[activeWorldRegion].x, cy: regionCoordinates[activeWorldRegion].y, r: 42 }));

    const firstRegion = worldMap.querySelector('.continent');
    worldMap.insertBefore(silhouette, firstRegion);
    worldMap.insertBefore(borders, firstRegion);
    worldMap.insertBefore(heatCore, firstRegion);
    worldMap.appendChild(focusRing);
}

function getRankedRegions(scenario) {
    return Object.entries(scenario.zones)
        .filter(([regionName]) => regionName !== 'Global')
        .sort(([, regionA], [, regionB]) => {
            const severityDifference = severityWeight[regionB.level] - severityWeight[regionA.level];
            return severityDifference || regionB.alerts - regionA.alerts;
        });
}

function renderWorldWatchlist(scenario) {
    if (!mapDetailCard) {
        return;
    }

    let watchlist = mapDetailCard.querySelector('.region-watchlist');
    if (!watchlist) {
        watchlist = document.createElement('div');
        watchlist.className = 'region-watchlist';
        mapDetailCard.appendChild(watchlist);
    }

    const topRegions = getRankedRegions(scenario).slice(0, 4);
    watchlist.innerHTML = `
        <div class="region-watchlist-title">Focos activos</div>
        ${topRegions.map(([regionName, regionData]) => `
            <button class="region-watch-item ${regionData.level}${regionName === activeWorldRegion ? ' active' : ''}" type="button" data-region-name="${regionName}">
                <i aria-hidden="true"></i>
                <span><strong>${regionName}</strong>${severityLabels[regionData.level]}</span>
                <small>${regionData.alerts}</small>
            </button>
        `).join('')}
    `;

    watchlist.querySelectorAll('.region-watch-item').forEach((button) => {
        button.addEventListener('click', () => highlightWorldRegion(button.dataset.regionName));
    });
}

function getHeatColor(level) {
    if (level === 'critical') {
        return 'rgba(239, 68, 68, 0.78)';
    }
    if (level === 'grave') {
        return 'rgba(245, 158, 11, 0.68)';
    }
    return 'rgba(34, 197, 94, 0.48)';
}

function updatePulsePositions(scenario) {
    if (!worldMap) {
        return;
    }

    const topRegions = getRankedRegions(scenario).slice(0, 5);
    const pulses = worldMap.querySelectorAll('.heat-pulses .pulse');
    const heatCore = worldMap.querySelectorAll('.map-heat-core circle');

    topRegions.forEach(([regionName, regionData], index) => {
        const coordinates = regionCoordinates[regionName] || regionCoordinates.Global;
        const radius = regionData.level === 'critical' ? 72 : regionData.level === 'grave' ? 58 : 44;

        if (pulses[index]) {
            pulses[index].setAttribute('cx', coordinates.x);
            pulses[index].setAttribute('cy', coordinates.y);
            pulses[index].setAttribute('r', radius * 0.56);
            pulses[index].classList.remove('pulse-critical', 'pulse-grave', 'pulse-mild');
            pulses[index].classList.add(`pulse-${regionData.level}`);
            pulses[index].style.animationDelay = `${index * 0.22}s`;
        }

        if (heatCore[index]) {
            heatCore[index].setAttribute('cx', coordinates.x);
            heatCore[index].setAttribute('cy', coordinates.y);
            heatCore[index].setAttribute('r', radius);
            heatCore[index].setAttribute('fill', getHeatColor(regionData.level));
        }
    });
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
        mapRegionSeverity.textContent = severityLabels[zoneData.level] || zoneData.level;
    }
    if (mapRegionRecommendation) {
        mapRegionRecommendation.textContent = zoneData.recommendation;
    }
    if (mapDetailCard) {
        mapDetailCard.classList.remove('is-critical', 'is-grave', 'is-mild');
        mapDetailCard.classList.add(`is-${zoneData.level}`);
    }

    const focusCircle = worldMap ? worldMap.querySelector('.map-focus-ring circle') : null;
    const coordinates = regionCoordinates[regionName] || regionCoordinates.Global;
    if (focusCircle) {
        focusCircle.setAttribute('cx', coordinates.x);
        focusCircle.setAttribute('cy', coordinates.y);
        focusCircle.setAttribute('r', zoneData.level === 'critical' ? 58 : zoneData.level === 'grave' ? 48 : 40);
    }
}

function applyHeatmapScenario(scenario) {
    currentHeatmapScenario = scenario;

    const regionNodes = worldMap ? worldMap.querySelectorAll('.continent') : [];
    regionNodes.forEach((regionNode) => {
        const zoneName = regionNode.dataset.region;
        const zoneData = scenario.zones[zoneName];
        if (!zoneData) {
            return;
        }

        regionNode.classList.remove('critical', 'grave', 'mild', 'active');
        regionNode.classList.add(zoneData.level);
        regionNode.setAttribute('aria-label', `${zoneName}: ${severityLabels[zoneData.level]}, ${zoneData.alerts} alertas`);
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

    updatePulsePositions(scenario);
    updateWorldDetail(activeWorldRegion, scenario);
    renderWorldWatchlist(scenario);
}

function highlightWorldRegion(regionName) {
    activeWorldRegion = regionName;
    updateWorldDetail(regionName, currentHeatmapScenario);
    if (heatmapStatus) {
        const regionData = currentHeatmapScenario.zones[regionName];
        heatmapStatus.textContent = `Región seleccionada: ${regionName} · ${regionData.alerts} alertas · severidad ${severityLabels[regionData.level]}.`;
    }
    if (worldMap) {
        worldMap.querySelectorAll('.continent').forEach((node) => node.classList.toggle('active', node.dataset.region === regionName));
    }
    renderWorldWatchlist(currentHeatmapScenario);
}

if (heatmapButton) {
    heatmapButton.addEventListener('click', () => {
        const nextIndex = (heatmapScenarios.indexOf(currentHeatmapScenario) + 1) % heatmapScenarios.length;
        applyHeatmapScenario(heatmapScenarios[nextIndex]);
    });
}

if (worldMap) {
    ensureRealWorldMap();
    worldMap.querySelectorAll('.continent').forEach((regionNode) => {
        regionNode.addEventListener('click', () => highlightWorldRegion(regionNode.dataset.region));
        regionNode.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                highlightWorldRegion(regionNode.dataset.region);
            }
        });
    });
    applyHeatmapScenario(currentHeatmapScenario);
    highlightWorldRegion(activeWorldRegion);
}

if (heatmapStatus) {
    heatmapStatus.textContent = 'Mapa mundial activo. Haz clic en una región o foco activo para ver prioridad y recomendación.';
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
