-- Remove a view se ela já existir para evitar conflitos de nomes de colunas
drop view if exists public.vw_reversa_comparacao;

-- Cria a view com os nomes de colunas solicitados
create view public.vw_reversa_comparacao as
select
    -- Colunas específicas solicitadas (serial, obs, caixa, sap, tecnologia)
    coalesce(a.enderecavel_principal, r.serial) as serial,
    ''::text as obs,
    r.cx as caixa,
    a.codigo_fornecedor_sap as sap,
    r.operacao as tecnologia,
    -- Colunas originais para manter o funcionamento do portal
    r.id,
    r.operacao,
    r.data_solicitacao,
    r.serial as serial_reversa,
    r.cx,
    r.quantidade,
    r.peso,
    r.created_at,
    r.volume_caixa,
    a.estado as situacao_atlas,
    a.nome_local as local_atlas,
    case
        when a.enderecavel_principal is not null then 'Sim'
        else 'Não'
    end as encontrado
from public.reversa r
left join public.base_atlas a
    on upper(trim(coalesce(r.serial, ''))) = upper(trim(coalesce(a.enderecavel_principal, '')));
