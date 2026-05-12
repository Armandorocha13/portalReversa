const xlsx = require('xlsx');

const SUPABASE_URL = 'https://ejxsdskyfbuthjcdqvkx.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqeHNkc2t5ZmJ1dGhqY2Rxdmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzQ4OTUsImV4cCI6MjA5NDAxMDg5NX0.3EzqKEcWorDHx37jD-o06ffcVJapNe_HPj49ziJjAM0';

async function importData() {
  console.log("Lendo arquivo Excel...");
  const workbook = xlsx.readFile('BASE ATLAS.xlsx');
  const sheet_name_list = workbook.SheetNames;
  const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { raw: false, defval: null });

  console.log(`Total de linhas encontradas: ${xlData.length}`);

  const asTextOrNull = (value) => {
    if (value === undefined || value === null) return null;
    const text = String(value).trim();
    return text === '' ? null : text;
  };

  const mappedData = xlData.map(row => ({
    nome_origem: asTextOrNull(row['Nome da Origem']),
    tipo: asTextOrNull(row['Tipo']),
    modelo: asTextOrNull(row['Modelo']),
    codigo_item_jde: asTextOrNull(row['Código Item JDE']),
    codigo_material_sap: asTextOrNull(row['Código Material SAP']),
    numero_serie: asTextOrNull(row['Número Série']),
    enderecavel_principal: asTextOrNull(row['Endereçavel Principal']),
    operacao: asTextOrNull(row['Operação']),
    nome_local: asTextOrNull(row['Nome do Local']),
    perfil: asTextOrNull(row['Perfil']),
    codigo_fornecedor_jde: asTextOrNull(row['Código Fornecedor JDE']),
    codigo_fornecedor_sap: asTextOrNull(row['Código Fornecedor SAP']),
    estado: asTextOrNull(row['Estado']),
    data_ultima_alteracao: asTextOrNull(row['Data Última Alteração']),
    responsavel: asTextOrNull(row['Responsavél']),
    numero_contrato: asTextOrNull(row['Número do Contrato']),
    classificacao_material: asTextOrNull(row['Classificacação Material']),
    empresa_material: asTextOrNull(row['Empresa Material'])
  }));

  const BATCH_SIZE = 1000;
  for (let i = 0; i < mappedData.length; i += BATCH_SIZE) {
    const batch = mappedData.slice(i, i + BATCH_SIZE);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/base_atlas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(batch)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`Erro no lote ${i} a ${i + batch.length}:`, err);
      break;
    } else {
      console.log(`Inserido com sucesso: linhas ${i + 1} até ${Math.min(i + batch.length, mappedData.length)}`);
    }
  }
  console.log("Processo de importação concluído.");
}

importData().catch(console.error);
