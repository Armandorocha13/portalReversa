# Planejamento do Sistema: Portal de Reversa

## **Planejamento em Sprints com Prompts**
O objetivo deste planejamento é organizar o desenvolvimento do sistema em **sprints** curtas e entregáveis, com cada **prompt/tarefa** servindo para analisar e implementar uma funcionalidade específica do sistema.

---

## **Sprint 1: Configuração do Projeto**

**Prompt 1: Criar o projeto base com Next.js**
- **Objetivo**: Iniciar o projeto e configurar as dependências básicas.
- **Escreva o seguinte código/configuração**:
  ```bash
  # Criação do projeto
  npx create-next-app reversa-portal
  cd reversa-portal

  # Instalação do TailwindCSS
  npm install tailwindcss postcss autoprefixer
  npx tailwindcss init
  ```

**Prompt 2: Integração do Supabase para Autenticação**
```plaintext
Configure o Supabase para autenticar operadores. Crie uma página de login conectada à API do Supabase. Mostre feedback nos casos de falha ou sucesso no login.
```

**Prompt 3: Adicionar Deploy Inicial na Vercel**
```plaintext
Coloque o sistema no ar com um deploy básico na Vercel. Crie as variáveis de ambiente necessárias para autenticação (chaves do Supabase). Garanta uma pipeline CI/CD contínua.
```

---

## **Sprint 2: Etapa 1 - Importação de Planilhas**

**Prompt 1: Upload de Arquivo no Frontend**
```plaintext
Crie um componente React que permita o upload de arquivos Excel pelos usuários. Adicione validações de frontend para garantir que apenas arquivos `.xlsx` ou `.xls` sejam aceitos.
```

**Prompt 2: Validação de Planilha no Backend**
```plaintext
Crie uma API Route de backend (`/api/upload/excel`) que receba arquivos enviados, valide as colunas obrigatórias (Código, Volume, Peso) e detecte erros de formato. Retorne um log estruturado para frontend.
```

**Prompt 3: Exibição de Logs no Frontend**
```plaintext
Crie um componente no frontend que exiba os logs retornados do backend. Mostre os erros por linha e coluna, permitindo que o operador visualize facilmente os problemas.
```

---

## **Sprint 3: Etapa 2 - Processamento e Exportação para JSON**

**Prompt 1: Gerar JSON no Backend**
```plaintext
Crie uma API Route (`/api/process/excel`) que transforme dados validados da planilha Excel em um arquivo JSON estruturado. O JSON deve incluir os campos: Código, Volume, Peso e operador responsável.
```

**Prompt 2: Download e Visualização de JSON**
```plaintext
No frontend, adicione um botão para que o operador possa fazer o download manual do JSON gerado ou enviá-lo automaticamente para o sistema externo em uma etapa posterior.
```

**Prompt 3: Armazenamento no Supabase**
```plaintext
Configure um serviço no backend que salve todos os JSONs gerados (aprovados e rejeitados) no banco de dados do Supabase. Armazene informações de meta (operador, timestamp, status).
```

---

## **Sprint 4: Etapa 3 - Processamento de Notas Espelho (PDF/XML)**

**Prompt 1: Upload de Arquivo PDF/XML**
```plaintext
Desenvolva um componente frontend que permita o upload de arquivos PDF e XML. Valide o tipo do arquivo antes de enviá-lo para o backend.
```

**Prompt 2: Processamento de XML no Backend**
```plaintext
Crie uma API Route (`/api/process/xml`) que faça o parsing de arquivos XML para JSON. Utilize a biblioteca `xml2js` para interpretar os campos (código, peso, Volume).
```

**Prompt 3: Processamento de PDFs com OCR**
```plaintext
Desenvolva uma API Route (`/api/process/pdf`) que processe arquivos PDF em duas etapas:
1. Extraia texto diretamente de PDFs legíveis.
2. Utilize o OCR (`tesseract.js`) para extrair texto de PDFs escaneados, convertendo cada página para imagem e reconhecendo campos básicos (código, peso, Volume).
```

---

## **Sprint 5: Validação e Cruzamento de Dados**

**Prompt 1: Comparação de Dados (Backend)**
```plaintext
Crie uma API Route (`/api/validate`) que compare os dados das solicitações (planilhas) com as Notas Espelho (PDF/XML). Valide:
- Pesos entre solicitação e nota.
- Volumes entre solicitação e nota.
- Existência de códigos válidos.
```

**Prompt 2: Tela de Status no Frontend**
```plaintext
No frontend, desenvolva uma tabela que mostre o status de cada solicitação (aprovada ou rejeitada) e forneça logs de inconsistências, destacando peso/Volume incompatíveis ou códigos inválidos.
```

---

## **Sprint 6: Integração com o Sistema Conect**

**Prompt 1: Exportação e Envio Automático**
```plaintext
Crie uma API Route (`/api/integrate`) que envie JSONs gerados (aprovados) para a API externa do sistema Conect. Configure validações para assegurar o sucesso do envio.
```

**Prompt 2: Registro de Integrações**
```plaintext
Armazene no banco de dados (Supabase) o status de cada integração: JSON enviado, timestamp, status (sucesso ou erro). Garanta que falhas sejam registradas.
```

**Prompt 3: Notificação por E-mail**
```plaintext
Implemente um serviço de envio de e-mails (ex.: SendGrid ou Supabase Functions) que notifique os operadores em caso de:
- Sucesso ao enviar a solicitação ao Conect.
- Problemas encontrados durante a integração.
```

---

## **Sprint 7: Testes Finais e Homologação**

**Prompt 1: Testes com Dados Reais**
```plaintext
Teste o sistema utilizando uma variedade de planilhas e notas espelho reais. Certifique-se de testar diferentes tipos de erro (colunas ausentes, PDFs ilegíveis, formatos de peso inconsistentes).
```

**Prompt 2: Ajustes de Validação**
```plaintext
Refine as validações para garantir que exceções sejam tratadas adequadamente, como:
- Pesos em diferentes formatos decimais.
- Manutenção da precisão dos dados extraídos do OCR.
```

**Prompt 3: Responsividade e UX**
```plaintext
Otimize o layout do sistema para compatibilidade com dispositivos móveis, utilizando Tailwind CSS para garantir design responsivo.
```

---

## **Sprint 8: Deploy Final**

**Prompt 1: Configuração de Produção**
```plaintext
Configure o projeto para produção (Vercel):
1. Ad
