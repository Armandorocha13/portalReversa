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

    if (!runBtn || !downloadBtn || !previewBody || !summaryTotal || !summaryMatched || !summaryMissing) {
        return;
    }

    let comparisonResults = [];

    runBtn.addEventListener('click', async () => {
        runBtn.disabled = true;
        runBtn.textContent = 'Sincronizando...';
        
        showLoading(true);
        updateLoadingProgress(0);

        try {
            updateLoadingProgress(20);
            
            // DADOS MOCADOS PARA TESTE
            const reversaRows = [
                { serial: 'SN001', nome_origem: 'RIO DE JANEIRO', modelo: 'ONT NOKIA' },
                { serial: 'SN002', nome_origem: 'SÃO PAULO', modelo: 'HGW SAGEMCOM' },
                { serial: 'SN003', nome_origem: 'CURITIBA', modelo: 'ONT NOKIA' },
                { serial: 'SN004', nome_origem: 'PORTO ALEGRE', modelo: 'HGW SAGEMCOM' },
                { serial: 'SN005', nome_origem: 'BELO HORIZONTE', modelo: 'ONT NOKIA' },
                { serial: 'SN006', nome_origem: 'RIO DE JANEIRO', modelo: 'HGW SAGEMCOM' },
                { serial: 'SN007', nome_origem: 'MANAUS', modelo: 'ONT NOKIA' },
                { serial: 'SN008', nome_origem: 'RECIFE', modelo: 'HGW SAGEMCOM' },
                { serial: 'SN009', nome_origem: 'FORTALEZA', modelo: 'ONT NOKIA' },
                { serial: 'SN010', nome_origem: 'BRASÍLIA', modelo: 'HGW SAGEMCOM' }
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
            renderComparison(comparisonResults, previewBody, summaryTotal, summaryMatched, summaryMissing);
            downloadBtn.disabled = comparisonResults.length === 0;
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
        if (!comparisonResults.length) return;

        const exportData = comparisonResults.map((row) => ({
            chave_comparacao: row.key,
            status: row.status,
            nome_origem: row.nomeOrigem,
            modelo: row.modelo
        }));

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
            key: keyValue || '-',
            status: found ? 'ENCONTRADO' : 'NAO_ENCONTRADO',
            nomeOrigem: getFieldValue(row, 'nome_origem') || '-',
            modelo: getFieldValue(row, 'modelo') || '-'
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
        previewBody.innerHTML = '<tr><td colspan="4">Sem dados para exibição.</td></tr>';
        return;
    }

    previewBody.innerHTML = preview
        .map((row) => `
            <tr>
                <td>${escapeHtml(row.key)}</td>
                <td><span class="status-pill ${row.status === 'ENCONTRADO' ? 'status-ok' : 'status-missing'}">${row.status}</span></td>
                <td>${escapeHtml(row.nomeOrigem)}</td>
                <td>${escapeHtml(row.modelo)}</td>
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
