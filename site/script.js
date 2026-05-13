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
    const emisSection = document.getElementById('emisSection');
    const volumeEmisInput = document.getElementById('VolumeEmis');
    const pesoEmisInput = document.getElementById('pesoEmis');

    if (!form || !fileInput || !dropArea || !fileInfo || !fileName || !fileSize || !dropContent || !subText || !operacaoSelect || !emisSection || !volumeEmisInput || !pesoEmisInput) {
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

    function toggleEmisFields() {
        const isAltoGiroEmis = operacaoSelect.value === 'ALTO GIRO + EMIS';
        emisSection.classList.toggle('is-enabled', isAltoGiroEmis);
        volumeEmisInput.disabled = !isAltoGiroEmis;
        pesoEmisInput.disabled = !isAltoGiroEmis;
        volumeEmisInput.required = isAltoGiroEmis;
        pesoEmisInput.required = isAltoGiroEmis;
        if (!isAltoGiroEmis) {
            volumeEmisInput.value = '';
            pesoEmisInput.value = '';
        }
    }

    operacaoSelect.addEventListener('change', toggleEmisFields);
    toggleEmisFields();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const operacao = operacaoSelect.value;
        const baseSolicitacao = document.getElementById('baseSolicitacao').value;
        const data = document.getElementById('dataSolicitacao').value;
        const volume = document.getElementById('Volume').value;
        const peso = document.getElementById('peso').value;
        const volumeEmis = volumeEmisInput.value;
        const pesoEmis = pesoEmisInput.value;
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
        console.log('Volume EMIS:', volumeEmis || 'N/A');
        console.log('Peso EMIS (kg):', pesoEmis || 'N/A');
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

    if (
        !runBtn || !downloadBtn || !previewBody || !summaryTotal || !summaryMatched || !summaryMissing
        || !tableSearchFilter || !estadoFilter || !localFilter || !operacaoFilter
        || !startDateFilter || !endDateFilter || !clearFiltersBtn || !filterFeedback
    ) {
        return;
    }

    const reversaColumns = [
        'serial',
        'nome_origem',
        'modelo',
        'estado',
        'nome_local',
        'operacao',
        'data_ultima_alteracao'
    ];

    let comparisonResults = [];
    let filteredResults = [];

    function collectFilters() {
        return {
            search: tableSearchFilter.value.trim().toUpperCase(),
            estado: estadoFilter.value.trim().toUpperCase(),
            local: localFilter.value.trim().toUpperCase(),
            operacao: operacaoFilter.value.trim().toUpperCase(),
            startDate: startDateFilter.value,
            endDate: endDateFilter.value
        };
    }

    function updateFilterFeedback(total, shown) {
        filterFeedback.textContent = total === shown
            ? 'Mostrando todos os resultados'
            : `Mostrando ${shown} de ${total} resultados`;
    }

    function applyFiltersAndRender() {
        filteredResults = filterComparisonResults(comparisonResults, collectFilters());
        renderComparison(filteredResults, previewBody, summaryTotal, summaryMatched, summaryMissing);
        downloadBtn.disabled = filteredResults.length === 0;
        updateFilterFeedback(comparisonResults.length, filteredResults.length);
    }

    function resetFilters() {
        tableSearchFilter.value = '';
        estadoFilter.value = '';
        localFilter.value = '';
        operacaoFilter.value = '';
        startDateFilter.value = '';
        endDateFilter.value = '';
        applyFiltersAndRender();
    }

    function updateFilterOptions(rows) {
        const setOptions = (select, values) => {
            select.innerHTML = '<option value="">Todos</option>';
            values.forEach((value) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        };

        setOptions(estadoFilter, uniqueValues(rows.map((row) => row.estado)));
        setOptions(localFilter, uniqueValues(rows.map((row) => row.nome_local)));
        setOptions(operacaoFilter, uniqueValues(rows.map((row) => row.operacao)));
    }

    runBtn.addEventListener('click', async () => {
        runBtn.disabled = true;
        runBtn.textContent = 'Sincronizando...';
        
        showLoading(true);
        updateLoadingProgress(0);

        try {
            updateLoadingProgress(20);
            
            // DADOS MOCADOS PARA TESTE
            const reversaRows = [
                { serial: 'SN001', nome_origem: 'RIO DE JANEIRO', modelo: 'ONT NOKIA', estado: 'RJ', nome_local: 'RIO 01', operacao: 'TROCA', data_ultima_alteracao: '2026-01-01' },
                { serial: 'SN002', nome_origem: 'SÃO PAULO', modelo: 'HGW SAGEMCOM', estado: 'SP', nome_local: 'SP 01', operacao: 'RECOLHIMENTO', data_ultima_alteracao: '2026-01-03' },
                { serial: 'SN003', nome_origem: 'CURITIBA', modelo: 'ONT NOKIA', estado: 'PR', nome_local: 'CURITIBA 01', operacao: 'TROCA', data_ultima_alteracao: '2026-01-08' },
                { serial: 'SN004', nome_origem: 'PORTO ALEGRE', modelo: 'HGW SAGEMCOM', estado: 'RS', nome_local: 'POA 02', operacao: 'RECOLHIMENTO', data_ultima_alteracao: '2026-02-01' },
                { serial: 'SN005', nome_origem: 'BELO HORIZONTE', modelo: 'ONT NOKIA', estado: 'MG', nome_local: 'BH 01', operacao: 'TROCA', data_ultima_alteracao: '2026-02-03' },
                { serial: 'SN006', nome_origem: 'RIO DE JANEIRO', modelo: 'HGW SAGEMCOM', estado: 'RJ', nome_local: 'RIO 02', operacao: 'RECOLHIMENTO', data_ultima_alteracao: '2026-02-10' },
                { serial: 'SN007', nome_origem: 'MANAUS', modelo: 'ONT NOKIA', estado: 'AM', nome_local: 'MANAUS 01', operacao: 'TROCA', data_ultima_alteracao: '2026-03-02' },
                { serial: 'SN008', nome_origem: 'RECIFE', modelo: 'HGW SAGEMCOM', estado: 'PE', nome_local: 'RECIFE 01', operacao: 'RECOLHIMENTO', data_ultima_alteracao: '2026-03-07' },
                { serial: 'SN009', nome_origem: 'FORTALEZA', modelo: 'ONT NOKIA', estado: 'CE', nome_local: 'FORTALEZA 01', operacao: 'TROCA', data_ultima_alteracao: '2026-03-10' },
                { serial: 'SN010', nome_origem: 'BRASÍLIA', modelo: 'HGW SAGEMCOM', estado: 'DF', nome_local: 'BRASILIA 01', operacao: 'RECOLHIMENTO', data_ultima_alteracao: '2026-03-15' }
            ];
            
            updateLoadingProgress(50);

            const atlasRows = [
                { enderecavel_principal: 'SN001' },
                { enderecavel_principal: 'SN003' },
                { enderecavel_principal: 'SN005' },
                { enderecavel_principal: 'SN007' },
                { enderecavel_principal: 'SN009' }
            ];

            updateLoadingProgress(80);

            const reversaSerialColumn = detectSerialColumn(reversaRows);
            if (!reversaSerialColumn) {
                alert('Não foi possível identificar automaticamente a coluna de serial na tabela reversa.');
                return;
            }

            comparisonResults = compareRows(reversaRows, atlasRows, reversaSerialColumn);
            updateFilterOptions(comparisonResults);
            resetFilters();
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

        const exportData = filteredResults.map((row) => buildReversaExportRow(row, reversaColumns));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'comparacao');
        XLSX.writeFile(wb, `resultado_comparacao_reversa_${Date.now()}.xlsx`);
    });

    [
        tableSearchFilter,
        estadoFilter,
        localFilter,
        operacaoFilter,
        startDateFilter,
        endDateFilter
    ].forEach((element) => {
        element.addEventListener('input', applyFiltersAndRender);
        element.addEventListener('change', applyFiltersAndRender);
    });

    clearFiltersBtn.addEventListener('click', resetFilters);
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

function detectSerialColumn(rows) {
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
        'serial',
        'sn',
        'serial_number',
        'num_serie',
        'numeroserie'
    ];

    for (let i = 0; i < rankedCandidates.length; i += 1) {
        const candidate = rankedCandidates[i];
        const found = keyArray.find((k) => normalizeKey(k) === normalizeKey(candidate));
        if (found) return found;
    }

    return keyArray.find((k) => normalizeKey(k).includes('serial'))
        || keyArray.find((k) => normalizeKey(k).includes('serie'))
        || null;
}

function getFieldValue(row, key) {
    const aliases = {
        numero_serie: ['numero_serie', 'número série', 'número serie', 'numero serie'],
        serial: ['serial', 'numero_serie', 'número série', 'número serie', 'numero serie'],
        codigo_material_sap: ['codigo_material_sap', 'código material sap', 'codigo material sap'],
        enderecavel_principal: ['enderecavel_principal', 'endereçavel principal', 'enderecavel principal'],
        nome_origem: ['nome_origem', 'nome da origem'],
        modelo: ['modelo'],
        estado: ['estado'],
        nome_local: ['nome_local', 'nome do local'],
        operacao: ['operacao', 'operação'],
        data_ultima_alteracao: ['data_ultima_alteracao', 'data última alteração', 'data ultima alteracao']
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
    const atlasSet = new Set(
        atlasRows
            .map((row) => toComparable(getFieldValue(row, 'enderecavel_principal')))
            .filter((value) => value !== '')
    );

    return reversaRows.map((row) => {
        const keyValue = row[field] === undefined || row[field] === null ? '' : String(row[field]).trim();
        const normalizedKey = toComparable(keyValue);
        const found = normalizedKey !== '' && atlasSet.has(normalizedKey);
        return {
            serial: keyValue || '-',
            status: found ? 'ENCONTRADO' : 'NAO_ENCONTRADO',
            nome_origem: getFieldValue(row, 'nome_origem') || '-',
            modelo: getFieldValue(row, 'modelo') || '-',
            estado: getFieldValue(row, 'estado') || '-',
            nome_local: getFieldValue(row, 'nome_local') || '-',
            operacao: getFieldValue(row, 'operacao') || '-',
            data_ultima_alteracao: getFieldValue(row, 'data_ultima_alteracao') || '-'
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
                <td>${escapeHtml(row.serial)}</td>
                <td>${escapeHtml(row.nome_origem)}</td>
                <td>${escapeHtml(row.modelo)}</td>
                <td>${escapeHtml(row.estado)}</td>
                <td>${escapeHtml(row.nome_local)}</td>
                <td>${escapeHtml(row.operacao)}</td>
                <td>${escapeHtml(formatDateForDisplay(row.data_ultima_alteracao))}</td>
                <td><span class="status-pill ${row.status === 'ENCONTRADO' ? 'status-ok' : 'status-missing'}">${row.status}</span></td>
            </tr>
        `)
        .join('');
}

function uniqueValues(values) {
    return Array.from(
        new Set(values.map((value) => String(value || '').trim()).filter((value) => value && value !== '-'))
    ).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function filterComparisonResults(results, filters) {
    const startDate = filters.startDate ? parseDateValue(filters.startDate) : null;
    const endDate = filters.endDate ? parseDateValue(filters.endDate) : null;

    return results.filter((row) => {
        const serial = String(row.serial || '').toUpperCase();
        const nomeOrigem = String(row.nome_origem || '').toUpperCase();
        const modelo = String(row.modelo || '').toUpperCase();
        const estado = String(row.estado || '').toUpperCase();
        const local = String(row.nome_local || '').toUpperCase();
        const operacao = String(row.operacao || '').toUpperCase();

        const matchesSearch = !filters.search
            || serial.includes(filters.search)
            || nomeOrigem.includes(filters.search)
            || modelo.includes(filters.search);
        const matchesEstado = !filters.estado || estado === filters.estado;
        const matchesLocal = !filters.local || local === filters.local;
        const matchesOperacao = !filters.operacao || operacao === filters.operacao;

        const rowDate = parseDateValue(row.data_ultima_alteracao);
        const matchesStartDate = !startDate || (rowDate && rowDate >= startDate);
        const matchesEndDate = !endDate || (rowDate && rowDate <= endDate);

        return matchesSearch && matchesEstado && matchesLocal && matchesOperacao && matchesStartDate && matchesEndDate;
    });
}

function parseDateValue(value) {
    if (!value) return null;
    const text = String(value).trim();
    if (!text) return null;

    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        const parsedDate = new Date(`${text}T00:00:00`);
        return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    const brMatch = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (brMatch) {
        const parsedDate = new Date(`${brMatch[3]}-${brMatch[2]}-${brMatch[1]}T00:00:00`);
        return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    const parsedDate = new Date(text);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function formatDateForDisplay(value) {
    const parsedDate = parseDateValue(value);
    if (!parsedDate) return value || '-';
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
}

function getRowField(row, key) {
    if (key === 'serial') return row.serial || '-';
    return row[key] || '-';
}

function buildReversaExportRow(row, reversaColumns) {
    const exportRow = {};
    reversaColumns.forEach((column) => {
        exportRow[column] = getRowField(row, column);
    });
    exportRow.status = row.status || '-';
    return exportRow;
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
