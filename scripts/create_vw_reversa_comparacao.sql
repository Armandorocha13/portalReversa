-- View original para funcionamento do portal e filtros
create or replace view public.vw_reversa_comparacao as
select
    r.id,
    r.operacao,
    r.data_solicitacao,
    r.serial,
    r.cx,
    r.quantidade,
    r.peso,
    r.created_at,
    r.volume_caixa,
    a.estado as situacao_atlas,
    a.nome_local as local_atlas,
    a.codigo_fornecedor_sap,
    case
        when a.enderecavel_principal is not null then 'Sim'
        else 'Não'
    end as encontrado
from public.reversa r
left join public.base_atlas a
    on upper(trim(coalesce(r.serial, ''))) = upper(trim(coalesce(a.enderecavel_principal, '')));
