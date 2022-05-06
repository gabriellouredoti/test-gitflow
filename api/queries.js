module.exports = {
	entradaCalculo: `
    SELECT
      e.id,
      e.receita,
      IFNULL(e.valor, 0) as valor,
      IFNULL((CAST(e.valor AS int) - ( SELECT cast(sum(d.valor) as int) 
        FROM despesas d WHERE d.entrada_id = e.id)), e.valor) as saldo
    FROM entradas e
  `,
	entradaCalculoById: `
    SELECT 
      e.id, 
      e.receita, 
      IFNULL(e.valor, 0) as valor,
      IFNULL((cast(e.valor AS int) - (SELECT cast(sum(d.valor) as int) 
        FROM despesas d WHERE d.entrada_id = e.id)), e.valor) as saldo 
    FROM entradas e 
    WHERE e.id = ?
    LIMIT 1
  `,
	entradaDespesas: `
    SELECT 
      e.id, 
      e.receita, 
      IFNULL(e.valor, 0) as valor,
      IFNULL((SELECT sum(d.valor) FROM despesas d INNER JOIN saidas s ON s.id = d.saida_id
        WHERE d.entrada_id = e.id), 0) as saida,
      IFNULL(e.valor - (SELECT sum(d.valor) FROM despesas d INNER JOIN saidas s ON s.id = d.saida_id
        WHERE d.entrada_id = e.id), e.valor) as saldo  
    FROM entradas e
  `,
	regiaoCalculoVotos: `
    SELECT  
      IFNULL(sum((SELECT sum(qt_votos) FROM votacao_resultado vr WHERE municipio = m.nome)), 0) as qt_votos
    FROM regioes r
    INNER JOIN regiao_municipio rm ON rm.regiao_id = r.id
    INNER JOIN municipios m ON m.id = rm.municipio_id
    WHERE r.id = ?
    GROUP BY r.id
  `,
	regiaoCalculoEleitorados: `
    SELECT 
      IFNULL(sum(ee.qt_eleitorado), 0) as qt_eleitorado
    FROM estatistica_eleitorado ee 
    WHERE ee.municipio IN (
      SELECT m.nome FROM regioes r 
      INNER JOIN regiao_municipio rm ON rm.regiao_id = r.id
      INNER JOIN municipios m ON m.id = rm.municipio_id
      WHERE r.id = ?
    );
  `,
	resultadosApurados: `
    SELECT
      vs.nr_candidato, 
      vs.candidato, 
      IFNULL((SELECT sum(qt_votos) FROM votacao_resultado vr WHERE vr.municipio = vs.nome_municipio GROUP BY municipio), 0) as qt_votos,
      IFNULL((SELECT IFNULL(sum(ee.qt_eleitorado), 0) as qt_aptos 
        FROM estatistica_eleitorado ee 
        WHERE ee.municipio = vs.nome_municipio GROUP BY ee.municipio), 0) as qt_aptos,
      vs.nome_municipio 
    FROM votacao_secao vs
    LEFT JOIN votacao_municipal vm ON vm.cd_municipio = vs.cod_municipio
    GROUP BY vs.candidato, vs.nome_municipio
    ORDER BY candidato    
  `,
};
