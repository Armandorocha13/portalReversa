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

    const fileACESSORIOSInput = document.getElementById('fileACESSORIOS');
    const fileACESSORIOSName = document.getElementById('fileACESSORIOSName');

    if (!form || !fileInput || !dropArea || !fileInfo || !fileName || !fileSize || !dropContent || !subText || !operacaoSelect || !ACESSORIOSSection || !volumeACESSORIOSInput || !pesoACESSORIOSInput || !fileACESSORIOSInput || !fileACESSORIOSName) {
        return;
    }

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    });

    fileACESSORIOSInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            fileACESSORIOSName.textContent = file.name;
        } else {
            fileACESSORIOSName.textContent = 'Anexar Documento';
        }
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
        fileACESSORIOSInput.disabled = !isAltoGiroACESSORIOS;
        volumeACESSORIOSInput.required = isAltoGiroACESSORIOS;
        pesoACESSORIOSInput.required = isAltoGiroACESSORIOS;
        fileACESSORIOSInput.required = isAltoGiroACESSORIOS;
        if (!isAltoGiroACESSORIOS) {
            volumeACESSORIOSInput.value = '';
            pesoACESSORIOSInput.value = '';
            fileACESSORIOSInput.value = '';
            fileACESSORIOSName.textContent = 'Anexar Documento';
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
    const previewHeadRow = document.getElementById('comparisonPreviewHeadRow');
    const previewBody = document.getElementById('comparisonPreviewBody');
    const summaryTotal = document.getElementById('summaryTotal');
    const summaryMatched = document.getElementById('summaryMatched');
    const summaryMissing = document.getElementById('summaryMissing');
    const filterStatus = document.getElementById('exportFilterStatus');
    const filterEstado = document.getElementById('exportFilterEstado');
    const filterLocal = document.getElementById('exportFilterLocal');
    const filterEnderecavel = document.getElementById('exportFilterEnderecavel');
    const filterModelo = document.getElementById('exportFilterModelo');
    const filterSearch = document.getElementById('exportFilterSearch');
    const filterDate = document.getElementById('exportFilterDate');
    const clearFiltersBtn = document.getElementById('clearExportFiltersBtn');
    const filteredCountInfo = document.getElementById('filteredCountInfo');

    if (!runBtn || !downloadBtn || !previewHeadRow || !previewBody || !summaryTotal || !summaryMatched || !summaryMissing || !filterStatus || !filterEstado || !filterLocal || !filterEnderecavel || !filterModelo || !filterSearch || !filterDate || !clearFiltersBtn || !filteredCountInfo) {
        return;
    }

    let comparisonResults = [];
    let filteredResults = [];
    let reversaColumns = [];
    let dynamicColumnsMap = {
        estado: null,
        local: null,
        modelo: null,
        enderecavel: null
    };

    function resetFilters() {
        filterStatus.value = '';
        filterEstado.value = '';
        filterLocal.value = '';
        filterEnderecavel.value = '';
        filterModelo.value = '';
        filterSearch.value = '';
        filterDate.value = '';
    }

    function updateFilteredCount(filteredTotal, fullTotal) {
        if (fullTotal === 0) {
            filteredCountInfo.textContent = 'Sem dados sincronizados.';
            return;
        }
        if (filteredTotal === fullTotal) {
            filteredCountInfo.textContent = `Exibindo ${fullTotal} registros.`;
            return;
        }
        filteredCountInfo.textContent = `Exibindo ${filteredTotal} de ${fullTotal} registros após filtros.`;
    }

    function setSelectOptions(selectElement, values, defaultText) {
        const options = [`<option value="">${defaultText}</option>`]
            .concat(values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`));
        selectElement.innerHTML = options.join('');
    }

    function setFilterAvailability(selectElement, enabled, emptyText) {
        selectElement.disabled = !enabled;
        if (!enabled) {
            selectElement.innerHTML = `<option value="">${emptyText}</option>`;
        }
    }

    function findColumnByCandidates(columns, candidates) {
        for (let i = 0; i < candidates.length; i += 1) {
            const candidate = candidates[i];
            const found = columns.find((column) => normalizeKey(column) === normalizeKey(candidate));
            if (found) return found;
        }
        return null;
    }

    function updateDynamicColumnsMap(columns, serialColumn) {
        dynamicColumnsMap = {
            estado: findColumnByCandidates(columns, ['estado']),
            local: findColumnByCandidates(columns, ['nome_local', 'nome_origem', 'local']),
            modelo: findColumnByCandidates(columns, ['modelo']),
            enderecavel: findColumnByCandidates(columns, ['enderecavel_principal', 'enderecavel', serialColumn || ''])
        };
    }

    function populateFilterOptions(results) {
        const estadoColumn = dynamicColumnsMap.estado;
        const localColumn = dynamicColumnsMap.local;
        const modeloColumn = dynamicColumnsMap.modelo;

        const estadoOptions = estadoColumn
            ? Array.from(new Set(results
                .map((row) => row.values[estadoColumn])
                .filter((value) => value && value !== '-')))
                .sort((a, b) => a.localeCompare(b, 'pt-BR'))
            : [];

        const localOptions = Array.from(new Set(results
            .map((row) => (localColumn ? row.values[localColumn] : ''))
            .filter((value) => value && value !== '-')))
            .sort((a, b) => a.localeCompare(b, 'pt-BR'));

        const modeloOptions = Array.from(new Set(results
            .map((row) => (modeloColumn ? row.values[modeloColumn] : ''))
            .filter((value) => value && value !== '-')))
            .sort((a, b) => a.localeCompare(b, 'pt-BR'));

        setFilterAvailability(filterEstado, Boolean(estadoColumn), 'Sem coluna de estado');
        setFilterAvailability(filterLocal, Boolean(localColumn), 'Sem coluna de local');
        setFilterAvailability(filterModelo, Boolean(modeloColumn), 'Sem coluna de modelo');

        if (estadoColumn) {
            setSelectOptions(filterEstado, estadoOptions, 'Todos os estados');
        }
        if (localColumn) {
            setSelectOptions(filterLocal, localOptions, 'Todos os locais');
        }
        if (modeloColumn) {
            setSelectOptions(filterModelo, modeloOptions, 'Todos os modelos');
        }

        filterEnderecavel.disabled = !dynamicColumnsMap.enderecavel;
        if (filterEnderecavel.disabled) {
            filterEnderecavel.value = '';
            filterEnderecavel.placeholder = 'Sem coluna de endereçável/serial';
        } else {
            filterEnderecavel.placeholder = 'Filtrar por serial/chave';
        }
    }

    function applyComparisonFilters() {
        const filters = {
            status: filterStatus.value,
            estado: filterEstado.value,
            local: filterLocal.value,
            enderecavel: filterEnderecavel.value,
            modelo: filterModelo.value,
            search: filterSearch.value,
            date: filterDate.value,
            columnsMap: dynamicColumnsMap
        };

        filteredResults = getFilteredComparisonResults(comparisonResults, filters, reversaColumns);
        renderComparison(filteredResults, previewHeadRow, previewBody, summaryTotal, summaryMatched, summaryMissing, reversaColumns);
        
        const hasResults = filteredResults.length > 0;
        downloadBtn.disabled = !hasResults;
        const connectBtn = document.getElementById('exportConnectBtn');
        const qualitorBtn = document.getElementById('exportQualitorBtn');
        if (connectBtn) connectBtn.disabled = !hasResults;
        if (qualitorBtn) qualitorBtn.disabled = !hasResults;
        
        const badge = document.getElementById('filteredCountInfo');
        if (badge) {
            badge.textContent = hasResults ? `${filteredResults.length} registros encontrados` : 'Nenhum registro encontrado';
            badge.className = `filtered-count-badge ${hasResults ? 'has-results' : 'no-results'}`;
        }
    }

    [filterStatus, filterEstado, filterLocal, filterModelo].forEach((el) => {
        el.addEventListener('change', applyComparisonFilters);
    });
    [filterEnderecavel, filterSearch].forEach((el) => {
        el.addEventListener('input', applyComparisonFilters);
    });
    filterDate.addEventListener('change', applyComparisonFilters);

    clearFiltersBtn.addEventListener('click', () => {
        resetFilters();
        applyComparisonFilters();
    });

    updateFilteredCount(0, 0);
    applyComparisonFilters();

    runBtn.addEventListener('click', async () => {
        runBtn.disabled = true;
        runBtn.textContent = 'Sincronizando...';

        showLoading(true);
        updateLoadingProgress(0);

        try {
            updateLoadingProgress(20);

            // BUSCA DADOS DA VIEW (JÁ CRUZADOS NO BANCO)
            const res = await fetch(`${SUPABASE_URL}/rest/v1/vw_reversa_comparacao?select=*`, {
                headers: { 
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
            
            if (!res.ok) throw new Error('Falha ao buscar dados da view');
            const rows = await res.json();

            if (rows.length === 0) {
                alert('A tabela reversa está vazia. Importe dados antes de sincronizar.');
                showLoading(false);
                runBtn.disabled = false;
                runBtn.textContent = 'Sincronizar';
                return;
            }

            updateLoadingProgress(70);

            // MAPEIA OS DADOS DA VIEW PARA O FORMATO DA INTERFACE
            // Colunas da reversa (originais)
            reversaColumns = ['operacao', 'data_solicitacao', 'serial', 'cx', 'quantidade', 'peso', 'created_at'];
            const reversaSerialColumn = 'serial';
            
            updateDynamicColumnsMap(reversaColumns, reversaSerialColumn);
            
            comparisonResults = rows.map(row => ({
                status: row.encontrado,
                values: {
                    operacao: row.operacao,
                    data_solicitacao: row.data_solicitacao,
                    serial: row.serial,
                    cx: row.cx,
                    quantidade: row.quantidade,
                    peso: row.peso,
                    created_at: row.created_at
                },
                atlasData: {
                    estado: row.situacao_atlas || '-',
                    nome_local: row.local_atlas || '-'
                }
            }));

            populateFilterOptions(comparisonResults);
            resetFilters();
            applyComparisonFilters();
        } catch (error) {
            comparisonResults = [];
            filteredResults = [];
            reversaColumns = [];
            updateDynamicColumnsMap(reversaColumns, null);
            populateFilterOptions(comparisonResults);
            resetFilters();
            applyComparisonFilters();
            console.error(error);
            alert('Não foi possível sincronizar os dados. Verifique a conexão com o banco.');
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

        const exportData = filteredResults.map((row) => {
            const data = {};
            reversaColumns.forEach((column) => {
                data[column] = row.values[column];
            });
            data['SITUAÇÃO ATLAS'] = row.atlasData.estado;
            data['LOCAL ATLAS'] = row.atlasData.nome_local;
            data['ENCONTRADO'] = row.status;
            return data;
        });

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'comparacao');
        XLSX.writeFile(wb, `resultado_comparacao_reversa_${Date.now()}.xlsx`);
    });
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

function normalizeText(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toUpperCase();
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
        codigo_material_sap: ['codigo_material_sap', 'código material sap', 'codigo material sap'],
        enderecavel_principal: ['enderecavel_principal', 'endereçavel principal', 'enderecavel principal'],
        nome_origem: ['nome_origem', 'nome da origem'],
        modelo: ['modelo']
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

function getOrderedColumns(rows) {
    if (!rows.length) return [];
    const orderedColumns = Object.keys(rows[0] || {});
    rows.forEach((row) => {
        Object.keys(row || {}).forEach((key) => {
            if (!orderedColumns.includes(key)) {
                orderedColumns.push(key);
            }
        });
    });
    return orderedColumns;
}

function toDisplayValue(value) {
    if (value === undefined || value === null) return '-';
    const text = String(value).trim();
    return text === '' ? '-' : text;
}

function compareRows(reversaRows, atlasRows, field, columns) {
    const atlasMap = new Map();
    atlasRows.forEach((row) => {
        const serial = toComparable(getFieldValue(row, 'enderecavel_principal'));
        if (serial) {
            atlasMap.set(serial, {
                estado: row.estado || '-',
                nome_local: row.nome_local || '-'
            });
        }
    });

    return reversaRows.map((row) => {
        const keyValue = row[field] === undefined || row[field] === null ? '' : String(row[field]).trim();
        const normalizedKey = toComparable(keyValue);
        const atlasData = atlasMap.get(normalizedKey);
        const found = !!atlasData;
        const values = columns.reduce((acc, column) => {
            acc[column] = toDisplayValue(row[column]);
            return acc;
        }, {});
        return {
            status: found ? 'Sim' : 'Não',
            values,
            atlasData: atlasData || { estado: '-', nome_local: '-' }
        };
    });
}

function getFilteredComparisonResults(results, filters, columns) {
    const estadoColumn = filters.columnsMap.estado;
    const localColumn = filters.columnsMap.local;
    const modeloColumn = filters.columnsMap.modelo;
    const enderecavelColumn = filters.columnsMap.enderecavel;
    const enderecavelNeedle = normalizeText(filters.enderecavel);
    const searchNeedle = normalizeText(filters.search);
    const filterDateValue = filters.date;

    return results.filter((row) => {
        if (filters.status && row.status !== filters.status) return false;
        if (filters.estado && estadoColumn && row.values[estadoColumn] !== filters.estado) return false;
        if (filters.local && localColumn && row.values[localColumn] !== filters.local) return false;
        if (filters.modelo && modeloColumn && row.values[modeloColumn] !== filters.modelo) return false;

        if (enderecavelNeedle && enderecavelColumn && !normalizeText(row.values[enderecavelColumn]).includes(enderecavelNeedle)) {
            return false;
        }

        if (filterDateValue) {
            // Tenta encontrar uma coluna de data
            const dateColumn = columns.find(c => normalizeKey(c).includes('data'));
            if (dateColumn && row.values[dateColumn] !== filterDateValue) {
                return false;
            }
        }

        if (searchNeedle) {
            const rowValues = columns.map((column) => row.values[column]).join(' ');
            const atlasValues = [row.atlasData.estado, row.atlasData.nome_local].join(' ');
            const haystack = normalizeText([row.status, rowValues, atlasValues].join(' '));
            if (!haystack.includes(searchNeedle)) {
                return false;
            }
        }

        return true;
    });
}

function formatColumnLabel(columnName) {
    return String(columnName || '')
        .replace(/_/g, ' ')
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function renderComparison(results, previewHeadRow, previewBody, summaryTotal, summaryMatched, summaryMissing, columns) {
    const matchedCount = results.filter((row) => row.status === 'Sim').length;
    const missingCount = results.length - matchedCount;

    summaryTotal.textContent = String(results.length);
    summaryMatched.textContent = String(matchedCount);
    summaryMissing.textContent = String(missingCount);

    const headers = columns.concat(['estado_atlas', 'local_atlas', 'status']);
    previewHeadRow.innerHTML = headers.map((header) => {
        if (header === 'status') return '<th>ENCONTRADO</th>';
        if (header === 'estado_atlas') return '<th>SITUAÇÃO ATLAS</th>';
        if (header === 'local_atlas') return '<th>LOCAL ATLAS</th>';
        return `<th>${escapeHtml(formatColumnLabel(header))}</th>`;
    }).join('');

    const preview = results.slice(0, 20);
    if (!preview.length) {
        previewBody.innerHTML = `<tr><td colspan="${headers.length}">Sem dados para exibição.</td></tr>`;
        return;
    }

    previewBody.innerHTML = preview
        .map((row) => `
            <tr>
                ${columns.map((column) => `<td>${escapeHtml(row.values[column])}</td>`).join('')}
                <td>${escapeHtml(row.atlasData.estado)}</td>
                <td>${escapeHtml(row.atlasData.nome_local)}</td>
                <td><span class="status-pill ${row.status === 'Sim' ? 'status-ok' : 'status-missing'}">${row.status}</span></td>
            </tr>
        `)
        .join('');
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
