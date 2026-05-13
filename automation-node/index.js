const { chromium } = require('playwright');
const path = require('path');

async function runAutomation(filePath) {
    if (!filePath) {
        console.error('Uso: node index.js <caminho_do_arquivo>');
        return;
    }

    const absolutePath = path.resolve(filePath);
    const fileName = path.basename(absolutePath);
    const fileNameNoExt = fileName.substring(0, fileName.lastIndexOf('.'));

    // Lógica de extração da cidade
    const parts = fileNameNoExt.split('_');
    let city = fileNameNoExt;
    if (parts.length > 2) {
        city = parts.slice(2).join(' ').toUpperCase();
    }

    console.log(`Iniciando automação para o arquivo: ${fileName}`);
    console.log(`Cidade identificada: ${city}`);

    const browser = await chromium.launch({ headless: false }); // Abre o navegador visível
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('Acessando Connect Control...');
        await page.goto('https://ffa.controlservices.com.br/login');

        // 1. Login
        console.log('Realizando login...');
        await page.fill('#email', 'thiagosouza@ffainfraestrutura.com.br');
        await page.fill('#password', 'Thiago@3540');
        await page.click('.btn-login');

        // 2. Navegação
        console.log('Navegando para Reversa...');
        await page.click('a.nav-link[href*="/estoque"]');
        await page.click('a.dropdown-toggle:has-text("Manutenção")');
        await page.click('a[href*="/estoque/reversa"]');

        // 3. Preenchimento do Formulário
        console.log('Preenchendo formulário...');

        // Data Saída (hoje no formato YYYY-MM-DD para input type="date")
        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0];
        await page.fill('//label[normalize-space()="Data Saida:"]/following::input[1]', formattedDate);

        // Status: Transito Reversa
        await page.selectOption('//label[normalize-space()="Status:"]/following::select[1]', { label: 'Transito Reversa' });

        // Lote e Nota Fiscal
        await page.fill('//label[normalize-space()="Lote:"]/following::input[1]', fileNameNoExt);
        await page.fill('//label[normalize-space()="Nota Fiscal:"]/following::input[1]', fileNameNoExt);

        // Cidades
        console.log(`Buscando cidade: "${city}"`);
        const cityDropdown = page.locator('//label[normalize-space()="Cidades:"]/following::select[1]');
        await selectByPartialText(cityDropdown, city);

        // Grupo (Base) - Lógica Condicional e Flexível
        const isAdesao = ['CURITIBA', 'SERRA', 'CAMPO GRANDE'].some(c => city.includes(c));
        const basePrefix = isAdesao ? 'ADESÃO' : 'DESCONEXÃO';
        
        console.log(`Buscando Base que contenha: "${basePrefix}" e algo de "${city}"`);
        const baseDropdown = page.locator('//label[normalize-space()="Grupo:"]/following::select[1]');
        
        // Busca flexível para o Grupo
        const baseOptions = await baseDropdown.locator('option').allTextContents();
        const targetBase = baseOptions.find(o => {
            const opt = o.toUpperCase();
            const cityName = city.toUpperCase();
            const prefix = basePrefix.toUpperCase();
            
            // Verifica se tem o prefixo (ADESÃO/DESCONEXÃO)
            if (!opt.includes(prefix)) return false;
            
            // Verifica se o nome da cidade está na opção OU se a opção (sem o prefixo) está no nome da cidade
            const baseCityPart = opt.replace(prefix, '').trim();
            return cityName.includes(baseCityPart) || baseCityPart.includes(cityName.split(' ')[0]);
        });

        if (targetBase) {
            console.log(`Base encontrada: "${targetBase.trim()}"`);
            await baseDropdown.selectOption({ label: targetBase.trim() });
        } else {
            console.warn(`Aviso: Base para "${city}" com prefixo "${basePrefix}" não encontrada.`);
        }

        // Upload do Arquivo
        console.log('Fazendo upload do arquivo...');
        await page.setInputFiles('//label[normalize-space()="Arquivo:"]/following::input[1]', absolutePath);

        // 4. Enviar
        console.log('Automação concluída! Verifique os dados preenchidos.');
        // await page.click('//button[normalize-space()="ENVIAR"]'); // Comentado por segurança

        // Mantém aberto para visualização
        await page.waitForTimeout(15000);

    } catch (error) {
        console.error('Erro na automação:', error);
    } finally {
        // await browser.close();
    }
}

// Função auxiliar para selecionar por texto parcial
async function selectByPartialText(locator, text) {
    const options = await locator.locator('option').allTextContents();
    console.log(`Opções disponíveis: [${options.map(o => `"${o.trim()}"`).join(', ')}]`);
    
    const target = options.find(o => o.toUpperCase().includes(text.toUpperCase()));
    if (target) {
        console.log(`Opção encontrada: "${target.trim()}"`);
        await locator.selectOption({ label: target.trim() });
    } else {
        console.warn(`Aviso: Opção que contém "${text}" não encontrada no menu.`);
    }
}

// Pega o arquivo do argumento da linha de comando
const filePath = process.argv[2];
runAutomation(filePath);
