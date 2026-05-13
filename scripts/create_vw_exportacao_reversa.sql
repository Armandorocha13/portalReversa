-- View dedicada para exportação (Connect/Qualitor)
create or replace view public.vw_exportacao_reversa as
select
    coalesce(a.enderecavel_principal, r.serial) as serial,
    ''::text as obs,
    r.cx as caixa,
    a.codigo_material_sap as sap,
    r.operacao as tecnologia
from public.reversa r
left join public.base_atlas a
    on upper(trim(coalesce(r.serial, ''))) = upper(trim(coalesce(a.enderecavel_principal, '')));
