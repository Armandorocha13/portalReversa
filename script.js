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
        const file = fileInput.files[0];
        if (!file) {
            alert('Por favor, selecione um arquivo.');
            return;
        }

        const operacao = operacaoSelect.value;
        const dataSolicitacao = document.getElementById('dataSolicitacao').value;

        showLoading(true);
        updateLoadingProgress(10);

        const pesoGeral = parseFloat(document.getElementById('peso').value) || 0;
        // O campo 'Volume' na tela refere-se à quantidade de caixas, 
        // enquanto a quantidade de equipamentos vem do arquivo.

        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (jsonData.length === 0) {
                throw new Error('O arquivo selecionado está vazio.');
            }

            updateLoadingProgress(40);

            // Identificar coluna de serial dinamicamente
            const sampleRow = jsonData[0];
            const serialCol = detectSerialColumn([sampleRow]) || 'serial';

            const payload = jsonData.map(row => {
                const serialValue = String(row[serialCol] || '').trim();
                const cxValue = String(row['cx'] || row['CX'] || row['Caixa'] || row['caixa'] || '').trim();
                
                const qtdEquipamento = parseFloat(row['quantidade'] || row['qtd'] || row['Qtd'] || row['Quant'] || row['QTDE'] || row['qtde'] || 1);

                return {
                    operacao: operacao,
                    data_solicitacao: dataSolicitacao,
                    serial: serialValue,
                    cx: cxValue,
                    quantidade: isNaN(qtdEquipamento) ? 1 : qtdEquipamento, 
                    peso: pesoGeral,
                    volume_caixa: 1 // Sempre 1 em todas as linhas, conforme solicitado
                };
            }).filter(item => item.serial && item.serial !== '-');

            if (payload.length === 0) {
                throw new Error('Nenhum registro válido (com serial) encontrado no arquivo.');
            }

            updateLoadingProgress(70);

            const response = await fetch(`${SUPABASE_URL}/rest/v1/reversa`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao salvar no banco de dados.');
            }

            updateLoadingProgress(100);
            await new Promise(resolve => setTimeout(resolve, 600));
            showLoading(false);
            
            alert(`Sucesso! ${payload.length} registros foram importados para a operação ${operacao}.`);
            
            // Limpar formulário
            form.reset();
            resetDropArea();
            toggleACESSORIOSFields(); // Resetar campos condicionais

        } catch (error) {
            console.error('Erro no processamento:', error);
            showLoading(false);
            alert(`Erro: ${error.message}`);
        }
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
    const previewHeadRow = document.getElementById('comparisonPreviewHeadRow');
    const previewBody = document.getElementById('comparisonPreviewBody');
    const summaryTotal = document.getElementById('summaryTotal');
    const summaryMatched = document.getElementById('summaryMatched');
    const summaryMissing = document.getElementById('summaryMissing');
    const filterStatus = document.getElementById('exportFilterStatus');
    const filterEstado = document.getElementById('exportFilterEstado');
    const filterLocal = document.getElementById('exportFilterLocal');
    const filterEnderecavel = document.getElementById('exportFilterEnderecavel');
    const filterOperacao = document.getElementById('exportFilterOperacao');
    const filterDate = document.getElementById('exportFilterDate');
    const clearFiltersBtn = document.getElementById('clearExportFiltersBtn');
    const filteredCountInfo = document.getElementById('filteredCountInfo');
    const exportConnectBtn = document.getElementById('exportConnectBtn');
    const copyQualitorBtn = document.getElementById('copyQualitorBtn');
    if (!runBtn || !previewHeadRow || !previewBody || !summaryTotal || !summaryMatched || !summaryMissing || !filterStatus || !filterEstado || !filterLocal || !filterEnderecavel || !filterOperacao || !filterDate || !clearFiltersBtn || !filteredCountInfo || !exportConnectBtn || !copyQualitorBtn) {
        return;
    }

    const defaultReversaColumns = ['operacao', 'data_solicitacao', 'serial', 'cx', 'quantidade', 'peso', 'created_at'];
    let comparisonResults = [];
    let filteredResults = [];
    let reversaColumns = [...defaultReversaColumns];
    let dynamicColumnsMap = {
        estado: null,
        local: null,
        operacao: null,
        enderecavel: null
    };
    updateDynamicColumnsMap(reversaColumns, 'serial');

    function resetFilters() {
        filterStatus.value = '';
        filterEstado.value = '';
        filterLocal.value = '';
        filterEnderecavel.value = '';
        filterOperacao.value = '';
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
            operacao: findColumnByCandidates(columns, ['operacao', 'operação']),
            enderecavel: findColumnByCandidates(columns, ['enderecavel_principal', 'enderecavel', serialColumn || ''])
        };
    }

    function populateFilterOptions(results) {
        const estadoColumn = dynamicColumnsMap.estado;
        const localColumn = dynamicColumnsMap.local;
        const operacaoColumn = dynamicColumnsMap.operacao;
        const hasAtlasData = results.some((row) => row && row.atlasData);

        const estadoOptions = Array.from(new Set(results
            .map((row) => (estadoColumn ? row.values[estadoColumn] : (row.atlasData ? row.atlasData.estado : '')))
            .filter((value) => value && value !== '-')))
            .sort((a, b) => a.localeCompare(b, 'pt-BR'));

        const localOptions = Array.from(new Set(results
            .map((row) => (localColumn ? row.values[localColumn] : (row.atlasData ? row.atlasData.nome_local : '')))
            .filter((value) => value && value !== '-')))
            .sort((a, b) => a.localeCompare(b, 'pt-BR'));

        const operacaoOptions = Array.from(new Set(results
            .map((row) => (operacaoColumn ? row.values[operacaoColumn] : ''))
            .filter((value) => value && value !== '-')))
            .sort((a, b) => a.localeCompare(b, 'pt-BR'));

        setFilterAvailability(filterEstado, Boolean(estadoColumn) || hasAtlasData, 'Sem coluna de estado');
        setFilterAvailability(filterLocal, Boolean(localColumn) || hasAtlasData, 'Sem coluna de local');
        setFilterAvailability(filterOperacao, Boolean(operacaoColumn), 'Sem coluna de operação');

        if (Boolean(estadoColumn) || hasAtlasData) {
            setSelectOptions(filterEstado, estadoOptions, 'Todas as situações');
        }
        if (Boolean(localColumn) || hasAtlasData) {
            setSelectOptions(filterLocal, localOptions, 'Todos os locais');
        }
        if (operacaoColumn) {
            setSelectOptions(filterOperacao, operacaoOptions, 'Todas as operações');
        }

        filterEnderecavel.disabled = !dynamicColumnsMap.enderecavel;
        if (filterEnderecavel.disabled) {
            filterEnderecavel.value = '';
            filterEnderecavel.placeholder = 'Sem coluna de serial';
        } else {
            filterEnderecavel.placeholder = 'Filtrar por serial';
        }
    }

    function applyComparisonFilters() {
        const filters = {
            status: filterStatus.value,
            estado: filterEstado.value,
            local: filterLocal.value,
            enderecavel: filterEnderecavel.value,
            operacao: filterOperacao.value,
            date: filterDate.value,
            columnsMap: dynamicColumnsMap
        };

        filteredResults = getFilteredComparisonResults(comparisonResults, filters, reversaColumns);
        renderComparison(filteredResults, previewHeadRow, previewBody, summaryTotal, summaryMatched, summaryMissing, reversaColumns);
        
        const hasResults = filteredResults.length > 0;
        exportConnectBtn.disabled = !hasResults;
        copyQualitorBtn.disabled = !hasResults;
        
        const badge = document.getElementById('filteredCountInfo');
        if (badge) {
            badge.textContent = hasResults ? `${filteredResults.length} registros encontrados` : 'Nenhum registro encontrado';
            badge.className = `filtered-count-badge ${hasResults ? 'has-results' : 'no-results'}`;
        }
    }

    [filterStatus, filterEstado, filterLocal, filterOperacao].forEach((el) => {
        el.addEventListener('change', applyComparisonFilters);
    });
    filterEnderecavel.addEventListener('input', applyComparisonFilters);
    filterDate.addEventListener('change', applyComparisonFilters);

    clearFiltersBtn.addEventListener('click', () => {
        resetFilters();
        applyComparisonFilters();
    });

    function getPreviousWeekInfo(referenceDate = new Date()) {
        const infoDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
        let month = infoDate.getMonth() + 1;
        let week = Math.ceil(infoDate.getDate() / 7) - 1;

        if (week < 1) {
            const prevMonthDate = new Date(infoDate.getFullYear(), infoDate.getMonth(), 0);
            month = prevMonthDate.getMonth() + 1;
            week = Math.ceil(prevMonthDate.getDate() / 7);
        }

        return { week, month };
    }

    function sanitizeFileNamePart(value) {
        return String(value || '')
            .trim()
            .replace(/[<>:"/\\|?*]/g, ' ')
            .replace(/\s+/g, ' ')
            .toUpperCase();
    }

    function resolveExportBaseName(results, selectedLocal) {
        const selected = sanitizeFileNamePart(selectedLocal);
        if (selected) return selected;

        const uniqueLocals = Array.from(new Set(
            results
                .map((row) => sanitizeFileNamePart(row && row.atlasData ? row.atlasData.nome_local : ''))
                .filter((value) => value && value !== '-')
        ));

        if (uniqueLocals.length === 1) {
            return uniqueLocals[0];
        }

        return 'BASE';
    }

    function buildExportFileName(results) {
        const { week, month } = getPreviousWeekInfo(new Date());
        const baseName = resolveExportBaseName(results, filterLocal.value);
        return `S${week}M${month}_${baseName}.xlsx`;
    }

    function buildExportRows(results, columns) {
        return results.map((row) => {
            const rowData = {};
            columns.forEach((column) => {
                if (column === 'created_at') {
                    rowData.DATA = row.values[column];
                } else {
                    rowData[formatColumnLabel(column)] = row.values[column];
                }
            });
            rowData['SITUAÇÃO ATLAS'] = row.atlasData.estado;
            rowData['LOCAL ATLAS'] = row.atlasData.nome_local;
            rowData.ENCONTRADO = row.status;
            return rowData;
        });
    }

    async function handleCopyQualitorSerials() {
        if (!filteredResults.length) {
            alert('Não há dados para copiar.');
            return;
        }

        try {
            // Extrai apenas os seriais dos resultados filtrados
            const serials = filteredResults
                .map(row => row.values.serial)
                .filter(s => s && s !== '-')
                .join('\n');

            if (!serials) {
                alert('Nenhum serial válido encontrado para copiar.');
                return;
            }

            await navigator.clipboard.writeText(serials);
            
            // Feedback visual no botão
            const originalText = copyQualitorBtn.innerHTML;
            copyQualitorBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Copiado!
            `;
            copyQualitorBtn.classList.add('success-btn');

            setTimeout(() => {
                copyQualitorBtn.innerHTML = originalText;
                copyQualitorBtn.classList.remove('success-btn');
            }, 2000);

        } catch (err) {
            console.error('Erro ao copiar:', err);
            alert('Falha ao copiar para a área de transferência.');
        }
    }

    async function fetchSapMapForSerials(serials) {
        const validSerials = Array.from(new Set(
            serials
                .map((value) => String(value || '').trim())
                .filter((value) => value !== '' && value !== '-')
        ));

        const sapMap = new Map();
        if (!validSerials.length) return sapMap;

        const chunkSize = 80;
        for (let i = 0; i < validSerials.length; i += chunkSize) {
            const chunk = validSerials.slice(i, i + chunkSize);
            const encodedValues = chunk.map((serial) => `"${String(serial).replace(/"/g, '""')}"`).join(',');
            const query = `${SUPABASE_URL}/rest/v1/base_atlas?select=enderecavel_principal,codigo_material_sap&enderecavel_principal=in.(${encodeURIComponent(encodedValues)})`;

            const response = await fetch(query, {
                method: 'GET',
                headers: {
                    apikey: SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${SUPABASE_ANON_KEY}`
                }
            });

            if (!response.ok) {
                const body = await response.text();
                throw new Error(`Falha ao buscar SAP na base_atlas: ${body}`);
            }

            const rows = await response.json();
            rows.forEach((atlasRow) => {
                const serial = String(atlasRow.enderecavel_principal || '').trim().toUpperCase();
                if (!serial) return;
                sapMap.set(serial, toDisplayValue(atlasRow.codigo_material_sap));
            });
        }

        return sapMap;
    }

    async function exportConnectResults() {
        if (!filteredResults.length) {
            alert('Não há dados para exportar.');
            return;
        }

        try {
            exportConnectBtn.disabled = true;
            const serials = filteredResults.map((row) => row.values.serial);
            const sapMap = await fetchSapMapForSerials(serials);
            const rowsForExport = filteredResults.map((row) => {
                const serial = toDisplayValue(row.values.serial);
                const serialKey = String(serial).trim().toUpperCase();
                return {
                    serial,
                    obs: '',
                    caixa: toDisplayValue(row.values.cx),
                    sap: sapMap.get(serialKey) || '',
                    tecnologia: toDisplayValue(row.values.operacao)
                };
            });

            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(rowsForExport, {
                header: ['serial', 'obs', 'caixa', 'sap', 'tecnologia']
            });
            XLSX.utils.book_append_sheet(workbook, worksheet, 'estoque_net');
            XLSX.writeFile(workbook, buildExportFileName(filteredResults));
        } catch (error) {
            console.error(error);
            alert('Não foi possível exportar o Connect com o SAP da base_atlas.');
        } finally {
            exportConnectBtn.disabled = filteredResults.length === 0;
        }
    }

    exportConnectBtn.addEventListener('click', exportConnectResults);
    copyQualitorBtn.addEventListener('click', handleCopyQualitorSerials);

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
                comparisonResults = [];
                filteredResults = [];
                reversaColumns = [...defaultReversaColumns];
                updateDynamicColumnsMap(reversaColumns, 'serial');
                populateFilterOptions(comparisonResults);
                resetFilters();
                applyComparisonFilters();
                alert('A tabela reversa está vazia. Importe dados antes de sincronizar.');
                showLoading(false);
                runBtn.disabled = false;
                runBtn.textContent = 'Sincronizar';
                return;
            }

            updateLoadingProgress(70);

            // MAPEIA OS DADOS DA VIEW PARA O FORMATO DA INTERFACE
            // Colunas da reversa (originais)
            reversaColumns = [...defaultReversaColumns];
            const reversaSerialColumn = 'serial';
            
            updateDynamicColumnsMap(reversaColumns, reversaSerialColumn);
            
            comparisonResults = rows.map(row => ({
                status: row.encontrado,
                values: {
                    operacao: row.operacao,
                    data_solicitacao: formatDate(row.data_solicitacao),
                    serial: row.serial,
                    cx: row.cx,
                    quantidade: row.quantidade,
                    peso: row.peso,
                    created_at: formatDate(row.created_at)
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
            reversaColumns = [...defaultReversaColumns];
            updateDynamicColumnsMap(reversaColumns, 'serial');
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
        'numeroserie',
        'codigo',
        'cod',
        'sap',
        'sap_code'
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

function formatDate(dateStr) {
    if (!dateStr || dateStr === '-') return '-';
    try {
        // Trata strings ISO e formatos comuns
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        
        // Ajuste de fuso horário para evitar problemas com datas "puras" (AAAA-MM-DD)
        // que o JS interpreta como UTC e pode mudar o dia
        if (typeof dateStr === 'string' && dateStr.length === 10 && dateStr.includes('-')) {
            const [y, m, d] = dateStr.split('-').map(Number);
            return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (e) {
        return dateStr;
    }
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
    const operacaoColumn = filters.columnsMap.operacao;
    const enderecavelColumn = filters.columnsMap.enderecavel;
    const enderecavelNeedle = normalizeText(filters.enderecavel);
    const filterDateValue = filters.date;

    return results.filter((row) => {
        if (filters.status && row.status !== filters.status) return false;
        const estadoValue = estadoColumn ? row.values[estadoColumn] : row.atlasData.estado;
        const localValue = localColumn ? row.values[localColumn] : row.atlasData.nome_local;
        if (filters.estado && estadoValue !== filters.estado) return false;
        if (filters.local && localValue !== filters.local) return false;
        if (filters.operacao && operacaoColumn && row.values[operacaoColumn] !== filters.operacao) return false;

        if (enderecavelNeedle && enderecavelColumn && !normalizeText(row.values[enderecavelColumn]).includes(enderecavelNeedle)) {
            return false;
        }

        if (filterDateValue) {
            // Tenta encontrar uma coluna de data
            const dateColumn = columns.find(c => normalizeKey(c).includes('data'));
            const normalizedFilterDate = formatDate(filterDateValue);
            if (dateColumn && row.values[dateColumn] !== normalizedFilterDate) {
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
        if (header === 'created_at') return '<th>DATA</th>';
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
