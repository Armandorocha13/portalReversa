document.addEventListener('DOMContentLoaded', () => {
    initReversaForm();
    initExportacoes();
});

const SUPABASE_URL = 'https://ejxsdskyfbuthjcdqvkx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqeHNkc2t5ZmJ1dGhqY2Rxdmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzQ4OTUsImV4cCI6MjA5NDAxMDg5NX0.3EzqKEcWorDHx37jD-o06ffcVJapNe_HPj49ziJjAM0';

function initReversaForm() {
    const form = document.getElementById('reversaForm');
    const fileInput = document.getElementById('fileInput');
    const dropArea = document.getElementById('dropArea');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const dropContent = document.querySelector('.drop-content p.main-text');
    const subText = document.querySelector('.drop-content p.sub-text');
    const operacaoSelect = document.getElementById('operacao');
    const ACESSORIOSSection = document.getElementById('ACESSORIOSSection');
    const volumeACESSORIOSInput = document.getElementById('VolumeACESSORIOS');
    const pesoACESSORIOSInput = document.getElementById('pesoACESSORIOS');

    if (!form || !fileInput || !dropArea || !fileInfo || !fileName || !fileSize || !dropContent || !subText || !operacaoSelect || !ACESSORIOSSection || !volumeACESSORIOSInput || !pesoACESSORIOSInput) {
        return;
    }

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('active'), false);
    });

    ['dragleave', 'drop'].forEach((eventName) => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('active'), false);
    });

    dropArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        if (file) {
            fileInput.files = dt.files;
            handleFile(file);
        }
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleFile(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls', 'xlsm', 'xml', 'csv'].includes(extension)) {
            alert('Por favor, selecione um arquivo válido (.xlsx, .xls, .xlsm, .xml, .csv)');
            fileInput.value = '';
            resetDropArea();
            return;
        }

        dropArea.classList.add('active');
        fileInfo.classList.remove('hidden');
        fileName.textContent = file.name;
        fileSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;
        dropContent.classList.add('hidden');
        subText.classList.add('hidden');
    }

    function resetDropArea() {
        dropArea.classList.remove('active');
        fileInfo.classList.add('hidden');
        dropContent.classList.remove('hidden');
        subText.classList.remove('hidden');
    }

    function toggleACESSORIOSFields() {
        const isAltoGiroACESSORIOS = operacaoSelect.value === 'ALTO GIRO + ACESSORIOS';
        ACESSORIOSSection.classList.toggle('is-enabled', isAltoGiroACESSORIOS);
        volumeACESSORIOSInput.disabled = !isAltoGiroACESSORIOS;
        pesoACESSORIOSInput.disabled = !isAltoGiroACESSORIOS;
        volumeACESSORIOSInput.required = isAltoGiroACESSORIOS;
        pesoACESSORIOSInput.required = isAltoGiroACESSORIOS;
        if (!isAltoGiroACESSORIOS) {
            volumeACESSORIOSInput.value = '';
            pesoACESSORIOSInput.value = '';
        }
    }

    operacaoSelect.addEventListener('change', toggleACESSORIOSFields);
    toggleACESSORIOSFields();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const operacao = operacaoSelect.value;
        const baseSolicitacao = document.getElementById('baseSolicitacao').value;
        const data = document.getElementById('dataSolicitacao').value;
        const volume = document.getElementById('Volume').value;
        const peso = document.getElementById('peso').value;
        const volumeACESSORIOS = volumeACESSORIOSInput.value;
        const pesoACESSORIOS = pesoACESSORIOSInput.value;
        const file = fileInput.files[0];

        if (!file) {
            alert('Por favor, selecione a planilha de reversa.');
            return;
        }

        console.log('--- Solicitação de Reversa ---');
        console.log('Operação:', operacao);
        console.log('Base:', baseSolicitacao);
        console.log('Data:', data);
        console.log('Volume:', volume);
        console.log('Peso (kg):', peso);
        console.log('Volume ACESSORIOS:', volumeACESSORIOS || 'N/A');
        console.log('Peso ACESSORIOS (kg):', pesoACESSORIOS || 'N/A');
        console.log('Arquivo:', file.name);

        handleSubmission();
    });

    async function handleSubmission() {
        showLoading(true);
        updateLoadingProgress(0);

        // Simulação de progresso premium
        for (let i = 0; i <= 100; i += Math.random() * 15) {
            const progress = Math.min(i, 100);
            updateLoadingProgress(progress);
            await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
        }

        updateLoadingProgress(100);
        await new Promise(resolve => setTimeout(resolve, 500));

        showLoading(false);
        alert('Solicitação processada com sucesso!');
    }
}

function showLoading(show) {
    console.log('showLoading:', show);
    const overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
        console.error('Elemento #loadingOverlay não encontrado!');
        return;
    }

    if (show) {
        overlay.classList.remove('hidden');
        overlay.style.display = 'flex'; // Garantir que apareça
        document.body.style.overflow = 'hidden';
    } else {
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function updateLoadingProgress(percentage) {
    console.log('Progress:', percentage);
    const bar = document.getElementById('progressBar');
    const text = document.getElementById('loadingPercentage');
    if (bar && text) {
        bar.style.width = `${percentage}%`;
        text.textContent = `${Math.round(percentage)}%`;
    }
}

function initExportacoes() {
    const runBtn = document.getElementById('runComparisonBtn');
    const downloadBtn = document.getElementById('downloadExportBtn');
    const previewBody = document.getElementById('comparisonPreviewBody');
    const summaryTotal = document.getElementById('summaryTotal');
    const summaryMatched = document.getElementById('summaryMatched');
    const summaryMissing = document.getElementById('summaryMissing');
    const tableSearchFilter = document.getElementById('tableSearchFilter');
    const estadoFilter = document.getElementById('estadoFilter');
    const localFilter = document.getElementById('localFilter');
    const operacaoFilter = document.getElementById('operacaoFilter');
    const startDateFilter = document.getElementById('startDateFilter');
    const endDateFilter = document.getElementById('endDateFilter');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const filterFeedback = document.getElementById('filterFeedback');

    if (!runBtn || !downloadBtn || !previewBody || !summaryTotal || !summaryMatched || !summaryMissing || !tableSearchFilter || !estadoFilter || !localFilter || !operacaoFilter || !startDateFilter || !endDateFilter || !clearFiltersBtn || !filterFeedback) {
        return;
    }

    let comparisonResults = [];
    let filteredResults = [];
    const reversaColumns = [
        { key: 'ENDEREÇAVEL PRINCIPAL', label: 'ENDEREÇAVEL PRINCIPAL' },
        { key: 'nome_origem', label: 'Nome da Origem' },
        { key: 'modelo', label: 'Modelo' },
        { key: 'estado', label: 'Estado' },
        { key: 'nome_local', label: 'Nome do Local' },
        { key: 'operacao', label: 'Operação' },
        { key: 'data_ultima_alteracao', label: 'Data Última Alteração' }
    ];

    runBtn.addEventListener('click', async () => {
        runBtn.disabled = true;
        runBtn.textContent = 'Sincronizando...';

        showLoading(true);
        updateLoadingProgress(0);

        try {
            updateLoadingProgress(20);

            // DADOS MOCADOS PARA TESTE
            const reversaRows = [
                { ENDEREÇAVEL PRINCIPAL: 'SN001', nome_origem: 'RIO DE JANEIRO', modelo: 'ONT NOKIA', estado: 'RJ', nome_local: 'RIO DE JANEIRO', operacao: 'ALTO GIRO + ACESSORIOS', data_ultima_alteracao: '2026-05-01' },
                { ENDEREÇAVEL PRINCIPAL: 'SN002', nome_origem: 'SÃO PAULO', modelo: 'HGW SAGEMCOM', estado: 'SP', nome_local: 'SÃO PAULO', operacao: 'BAIXO GIRO', data_ultima_alteracao: '2026-05-02' },
                { ENDEREÇAVEL PRINCIPAL: 'SN003', nome_origem: 'CURITIBA', modelo: 'ONT NOKIA', estado: 'PR', nome_local: 'CURITIBA', operacao: 'ETER 3.1', data_ultima_alteracao: '2026-05-03' },
                { ENDEREÇAVEL PRINCIPAL: 'SN004', nome_origem: 'PORTO ALEGRE', modelo: 'HGW SAGEMCOM', estado: 'RS', nome_local: 'PORTO ALEGRE', operacao: 'BAIXO GIRO', data_ultima_alteracao: '2026-05-06' },
                { ENDEREÇAVEL PRINCIPAL: 'SN005', nome_origem: 'BELO HORIZONTE', modelo: 'ONT NOKIA', estado: 'MG', nome_local: 'BELO HORIZONTE', operacao: 'ALTO GIRO + ACESSORIOS', data_ultima_alteracao: '2026-05-08' },
                { ENDEREÇAVEL PRINCIPAL: 'SN006', nome_origem: 'RIO DE JANEIRO', modelo: 'HGW SAGEMCOM', estado: 'RJ', nome_local: 'RIO DE JANEIRO', operacao: 'ALTO GIRO + ACESSORIOS', data_ultima_alteracao: '2026-05-09' },
                { ENDEREÇAVEL PRINCIPAL: 'SN007', nome_origem: 'MANAUS', modelo: 'ONT NOKIA', estado: 'AM', nome_local: 'MANAUS', operacao: 'ETER 3.1', data_ultima_alteracao: '2026-05-10' },
                { ENDEREÇAVEL PRINCIPAL: 'SN008', nome_origem: 'RECIFE', modelo: 'HGW SAGEMCOM', estado: 'PE', nome_local: 'RECIFE', operacao: 'BAIXO GIRO', data_ultima_alteracao: '2026-05-11' },
                { ENDEREÇAVEL PRINCIPAL: 'SN009', nome_origem: 'FORTALEZA', modelo: 'ONT NOKIA', estado: 'CE', nome_local: 'FORTALEZA', operacao: 'ALTO GIRO + ACESSORIOS', data_ultima_alteracao: '2026-05-12' },
                { ENDEREÇAVEL PRINCIPAL: 'SN010', nome_origem: 'BRASÍLIA', modelo: 'HGW SAGEMCOM', estado: 'DF', nome_local: 'BRASÍLIA', operacao: 'ETER 3.1', data_ultima_alteracao: '2026-05-13' }
            ];

            updateLoadingProgress(50);

            const atlasRows = [
                { enderecavel_principal: 'SN001', estado: 'RJ', nome_local: 'RIO DE JANEIRO', operacao: 'ALTO GIRO + ACESSORIOS', data_ultima_alteracao: '2026-05-01' },
                { enderecavel_principal: 'SN003', estado: 'PR', nome_local: 'CURITIBA', operacao: 'ETER 3.1', data_ultima_alteracao: '2026-05-03' },
                { enderecavel_principal: 'SN005', estado: 'MG', nome_local: 'BELO HORIZONTE', operacao: 'ALTO GIRO + ACESSORIOS', data_ultima_alteracao: '2026-05-08' },
                { enderecavel_principal: 'SN007', estado: 'AM', nome_local: 'MANAUS', operacao: 'ETER 3.1', data_ultima_alteracao: '2026-05-10' },
                { enderecavel_principal: 'SN009', estado: 'CE', nome_local: 'FORTALEZA', operacao: 'ALTO GIRO + ACESSORIOS', data_ultima_alteracao: '2026-05-12' }
            ];

            updateLoadingProgress(80);

            const reversaENDEREÇAVEL PRINCIPALColumn = detectENDEREÇAVEL PRINCIPALColumn(reversaRows);
            if (!reversaENDEREÇAVEL PRINCIPALColumn) {
        alert('Não foi possível identificar automaticamente a coluna de ENDEREÇAVEL PRINCIPAL na tabela reversa.');
        return;
    }

    comparisonResults = compareRows(reversaRows, atlasRows, reversaENDEREÇAVEL PRINCIPALColumn);
    populateFilterOptions(comparisonResults, estadoFilter, localFilter, operacaoFilter);
    syncFilterControls();
    applyFiltersAndRender();
    downloadBtn.disabled = filteredResults.length === 0;
} catch (error) {
    console.error(error);
    alert('Não foi possível comparar no banco. Verifique se as tabelas existem e têm acesso pela API.');
} finally {
    updateLoadingProgress(100);
    setTimeout(() => {
        runBtn.disabled = false;
        runBtn.textContent = 'Sincronizar';
        showLoading(false);
    }, 500);
}
    });

downloadBtn.addEventListener('click', () => {
    if (!filteredResults.length) return;

    const exportData = filteredResults.map((row) => buildReversaExportRow(row));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'comparacao');
    XLSX.writeFile(wb, `resultado_comparacao_reversa_${Date.now()}.xlsx`);
});

[tableSearchFilter, estadoFilter, localFilter, operacaoFilter, startDateFilter, endDateFilter].forEach((element) => {
    element.addEventListener('input', applyFiltersAndRender);
    element.addEventListener('change', applyFiltersAndRender);
});

clearFiltersBtn.addEventListener('click', () => {
    tableSearchFilter.value = '';
    estadoFilter.value = '';
    localFilter.value = '';
    operacaoFilter.value = '';
    startDateFilter.value = '';
    endDateFilter.value = '';
    applyFiltersAndRender();
});

function syncFilterControls() {
    tableSearchFilter.disabled = comparisonResults.length === 0;
    estadoFilter.disabled = comparisonResults.length === 0;
    localFilter.disabled = comparisonResults.length === 0;
    operacaoFilter.disabled = comparisonResults.length === 0;
    startDateFilter.disabled = comparisonResults.length === 0;
    endDateFilter.disabled = comparisonResults.length === 0;
    clearFiltersBtn.disabled = comparisonResults.length === 0;
}

function getActiveFilters() {
    return {
        search: normalizeKey(tableSearchFilter.value),
        estado: normalizeKey(estadoFilter.value),
        local: normalizeKey(localFilter.value),
        operacao: normalizeKey(operacaoFilter.value),
        startDate: startDateFilter.value,
        endDate: endDateFilter.value
    };
}

function applyFiltersAndRender() {
    if (!comparisonResults.length) {
        filteredResults = [];
        renderComparison([], previewBody, summaryTotal, summaryMatched, summaryMissing);
        filterFeedback.textContent = 'Sincronize para carregar os filtros.';
        downloadBtn.disabled = true;
        return;
    }

    const filters = getActiveFilters();
    filteredResults = filterComparisonResults(comparisonResults, filters);
    renderComparison(filteredResults, previewBody, summaryTotal, summaryMatched, summaryMissing);
    filterFeedback.textContent = `Mostrando ${filteredResults.length} de ${comparisonResults.length} registros.`;
    downloadBtn.disabled = filteredResults.length === 0;
}

function buildReversaExportRow(row) {
    const exportRow = {};
    reversaColumns.forEach((column) => {
        exportRow[column.key] = getRowField(row, column.key);
    });
    exportRow.status = row.status;
    return exportRow;
}

function getRowField(row, key) {
    const valueMap = {
        ENDEREÇAVEL PRINCIPAL: row.ENDEREÇAVEL PRINCIPAL || row.key || '-',
        nome_origem: row.nomeOrigem || '-',
            modelo: row.modelo || '-',
                estado: row.estado || '-',
                    nome_local: row.nomeLocal || '-',
                        operacao: row.operacao || '-',
                            data_ultima_alteracao: row.dataUltimaAlteracao || '-'
};
return valueMap[key] || '-';
    }
}

async function fetchAllRows(tableName, columns) {
    const uniqueColumns = Array.from(new Set(columns.filter((col) => !!col)));
    const selectQuery = uniqueColumns.join(',');
    const pageSize = 1000;
    let from = 0;
    const allRows = [];

    while (true) {
        const to = from + pageSize - 1;
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/${tableName}?select=${encodeURIComponent(selectQuery)}`,
            {
                method: 'GET',
                headers: {
                    apikey: SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                    Range: `${from}-${to}`
                }
            }
        );

        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Falha ao consultar ${tableName}: ${body}`);
        }

        const rows = await response.json();
        allRows.push(...rows);
        if (rows.length < pageSize) break;
        from += pageSize;
    }

    return allRows;
}

function toComparable(value) {
    if (value === null || value === undefined) return '';
    return String(value).trim().toUpperCase();
}

function normalizeKey(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '')
        .toLowerCase();
}

function resolveColumnName(rows, desiredName) {
    const normalizedDesired = normalizeKey(desiredName);
    if (!normalizedDesired) return null;

    const keys = new Set();
    rows.forEach((row) => {
        Object.keys(row || {}).forEach((k) => keys.add(k));
    });

    const keyArray = Array.from(keys);
    if (!keyArray.length) return desiredName;
    const exact = keyArray.find((k) => k === desiredName);
    if (exact) return exact;
    return keyArray.find((k) => normalizeKey(k) === normalizedDesired) || null;
}

function detectENDEREÇAVEL PRINCIPALColumn(rows) {
    const keys = new Set();
    rows.forEach((row) => {
        Object.keys(row || {}).forEach((k) => keys.add(k));
    });

    const keyArray = Array.from(keys);
    if (!keyArray.length) return null;

    const rankedCandidates = [
        'numero_serie',
        'número_série',
        'número_serie',
        'ENDEREÇAVEL PRINCIPAL',
        'sn',
        'ENDEREÇAVEL PRINCIPAL_number',
        'num_serie',
        'numeroserie'
    ];

    for (let i = 0; i < rankedCandidates.length; i += 1) {
        const candidate = rankedCandidates[i];
        const found = keyArray.find((k) => normalizeKey(k) === normalizeKey(candidate));
        if (found) return found;
    }

    return keyArray.find((k) => normalizeKey(k).includes('ENDEREÇAVEL PRINCIPAL'))
        || keyArray.find((k) => normalizeKey(k).includes('serie'))
        || null;
}

function getFieldValue(row, key) {
    const aliases = {
        numero_serie: ['numero_serie', 'número série', 'número serie', 'numero serie'],
        codigo_material_sap: ['codigo_material_sap', 'código material sap', 'codigo material sap'],
        enderecavel_principal: ['enderecavel_principal', 'endereçavel principal', 'enderecavel principal'],
        nome_origem: ['nome_origem', 'nome da origem'],
        modelo: ['modelo'],
        estado: ['estado'],
        nome_local: ['nome_local', 'nome do local', 'local'],
        operacao: ['operacao', 'operação', 'tipo de operação'],
        data_ultima_alteracao: ['data_ultima_alteracao', 'data ultima alteracao', 'data']
    };

    const rowMap = {};
    Object.keys(row || {}).forEach((k) => {
        rowMap[toComparable(k).toLowerCase()] = row[k];
    });

    const options = aliases[key] || [key];
    for (let i = 0; i < options.length; i += 1) {
        const candidate = options[i];
        const found = rowMap[toComparable(candidate).toLowerCase()];
        if (found !== undefined && found !== null && String(found).trim() !== '') {
            return String(found).trim();
        }
    }
    return '';
}

function compareRows(reversaRows, atlasRows, field) {
    const atlasMap = new Map();
    atlasRows.forEach((row) => {
        const atlasKey = toComparable(getFieldValue(row, 'enderecavel_principal'));
        if (atlasKey && !atlasMap.has(atlasKey)) {
            atlasMap.set(atlasKey, row);
        }
    });

    return reversaRows.map((row) => {
        const keyValue = row[field] === undefined || row[field] === null ? '' : String(row[field]).trim();
        const normalizedKey = toComparable(keyValue);
        const atlasRow = normalizedKey !== '' ? atlasMap.get(normalizedKey) : null;
        const found = !!atlasRow;
        return {
            key: keyValue || '-',
            ENDEREÇAVEL PRINCIPAL: keyValue || '-',
            status: found ? 'ENCONTRADO' : 'NAO_ENCONTRADO',
            nomeOrigem: getFieldValue(row, 'nome_origem') || '-',
            modelo: getFieldValue(row, 'modelo') || '-',
            estado: getFieldValue(atlasRow || row, 'estado') || '-',
            nomeLocal: getFieldValue(atlasRow || row, 'nome_local') || '-',
            operacao: getFieldValue(atlasRow || row, 'operacao') || '-',
            dataUltimaAlteracao: getFieldValue(atlasRow || row, 'data_ultima_alteracao') || '-'
        };
    });
}

function renderComparison(results, previewBody, summaryTotal, summaryMatched, summaryMissing) {
    const matchedCount = results.filter((row) => row.status === 'ENCONTRADO').length;
    const missingCount = results.length - matchedCount;

    summaryTotal.textContent = String(results.length);
    summaryMatched.textContent = String(matchedCount);
    summaryMissing.textContent = String(missingCount);

    const preview = results.slice(0, 20);
    if (!preview.length) {
        previewBody.innerHTML = '<tr><td colspan="8">Sem dados para exibição.</td></tr>';
        return;
    }

    previewBody.innerHTML = preview
        .map((row) => `
            <tr>
                <td>${escapeHtml(row.ENDEREÇAVEL PRINCIPAL || row.key)}</td>
                <td>${escapeHtml(row.nomeOrigem)}</td>
                <td>${escapeHtml(row.modelo)}</td>
                <td>${escapeHtml(row.estado)}</td>
                <td>${escapeHtml(row.nomeLocal)}</td>
                <td>${escapeHtml(row.operacao)}</td>
                <td>${escapeHtml(formatDateForDisplay(row.dataUltimaAlteracao))}</td>
                <td><span class="status-pill ${row.status === 'ENCONTRADO' ? 'status-ok' : 'status-missing'}">${row.status}</span></td>
            </tr>
        `)
        .join('');
}

function populateFilterOptions(results, estadoFilter, localFilter, operacaoFilter) {
    populateSelectOptions(estadoFilter, uniqueValues(results, 'estado'));
    populateSelectOptions(localFilter, uniqueValues(results, 'nomeLocal'));
    populateSelectOptions(operacaoFilter, uniqueValues(results, 'operacao'));
}

function populateSelectOptions(select, values) {
    const currentValue = select.value;
    const options = ['<option value="">Todos</option>']
        .concat(values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`))
        .join('');
    select.innerHTML = options;
    if (values.includes(currentValue)) {
        select.value = currentValue;
    }
}

function uniqueValues(rows, field) {
    const values = rows
        .map((row) => String(row[field] || '').trim())
        .filter((value, index, array) => value !== '' && value !== '-' && array.indexOf(value) === index);
    return values.sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function filterComparisonResults(results, filters) {
    const startTimestamp = parseDateValue(filters.startDate);
    const endTimestamp = parseDateValue(filters.endDate, true);

    return results.filter((row) => {
        if (filters.search) {
            const searchable = normalizeKey([
                row.ENDEREÇAVEL PRINCIPAL,
                row.nomeOrigem,
                row.modelo,
                row.estado,
                row.nomeLocal,
                row.operacao,
                row.dataUltimaAlteracao,
                row.status
            ].join(' '));
            if (!searchable.includes(filters.search)) {
                return false;
            }
        }

        if (filters.estado && normalizeKey(row.estado) !== filters.estado) {
            return false;
        }

        if (filters.local && normalizeKey(row.nomeLocal) !== filters.local) {
            return false;
        }

        if (filters.operacao && normalizeKey(row.operacao) !== filters.operacao) {
            return false;
        }

        if (startTimestamp !== null || endTimestamp !== null) {
            const rowTimestamp = parseDateValue(row.dataUltimaAlteracao);
            if (rowTimestamp === null) {
                return false;
            }
            if (startTimestamp !== null && rowTimestamp < startTimestamp) {
                return false;
            }
            if (endTimestamp !== null && rowTimestamp > endTimestamp) {
                return false;
            }
        }

        return true;
    });
}

function parseDateValue(value, endOfDay) {
    if (!value || value === '-') {
        return null;
    }

    const text = String(value).trim();
    if (!text) {
        return null;
    }

    const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
        const year = Number(isoMatch[1]);
        const month = Number(isoMatch[2]) - 1;
        const day = Number(isoMatch[3]);
        return new Date(year, month, day, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0).getTime();
    }

    const brMatch = text.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (brMatch) {
        const day = Number(brMatch[1]);
        const month = Number(brMatch[2]) - 1;
        const year = Number(brMatch[3]);
        return new Date(year, month, day, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0).getTime();
    }

    const parsed = Date.parse(text);
    if (Number.isNaN(parsed)) {
        return null;
    }
    return parsed;
}

function formatDateForDisplay(value) {
    if (!value || value === '-') {
        return '-';
    }

    const text = String(value).trim();
    if (!text) {
        return '-';
    }

    const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
        return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
    }

    return text;
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
