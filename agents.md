# SECURITY RULES — C-Trip (React/Next.js)

Estas regras são obrigatórias em qualquer código gerado, editado ou revisto para o projecto C-Trip. Não são sugestões — são restrições rígidas. Se um pedido do utilizador entrar em conflito com uma regra abaixo, avisa e sugere a alternativa segura em vez de a violar silenciosamente.

## XSS

- NUNCA usar `dangerouslySetInnerHTML` sem passar o conteúdo por `DOMPurify.sanitize()` imediatamente antes do render.
- NUNCA renderizar HTML vindo de API/backend sem sanitização no client, mesmo que o backend valide.
- NUNCA interpolar input do utilizador diretamente em `href`, `src` ou `style` sem validar o esquema (bloquear `javascript:` e `data:` em contextos de link/imagem de utilizador).
- SVGs vindos de upload de utilizador (logos, avatares) têm de ser sanitizados como XML antes de serem servidos ou renderizados.
- Validar MIME real de qualquer ficheiro carregado no servidor — nunca confiar só na extensão.

## CSP

- Toda a app serve com Content-Security-Policy definida via `headers()` no `next.config.js` ou middleware.
- `script-src` e `style-src`: PROIBIDO `unsafe-inline` e `unsafe-eval`. Usar nonce por request.
- `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`.
- `connect-src` restrito ao(s) domínio(s) real(is) da API C-Trip — nunca wildcard `*`.
- Novas políticas entram primeiro em `Content-Security-Policy-Report-Only`, só depois em enforce.

## Sanitização

- Todo o input de formulário passa por schema validation (`zod`/`yup`) antes de qualquer submit ou persistência.
- Sanitização acontece nos DOIS lados: client (UX) e servidor (fronteira real de confiança).
- Nunca interpolar parâmetros de URL/query string diretamente em queries de base de dados ou lógica de autorização.
- Nomes de ficheiro de upload passam por sanitização (bloquear path traversal, ex: `../`).

## Sessão e segredos

- Tokens de sessão/autenticação: NUNCA em `localStorage` ou `sessionStorage`. Usar cookies `httpOnly`, `Secure`, `SameSite=Strict` (ou `Lax` só se necessário para redirect de pagamento).
- Variáveis `NEXT_PUBLIC_*` são públicas no bundle client — proibido colocar chaves/segredos sensíveis nelas.
- CORS no backend: whitelist explícita de origens; nunca `Access-Control-Allow-Origin: *` combinado com `credentials: true`.

## Dependências e infraestrutura

- Rodar `npm audit` (ou equivalente) antes de merge; sinalizar vulnerabilidades críticas/altas.
- Rate limiting obrigatório em endpoints sensíveis: login, registo, compra de bilhete, criação de conta de operador.
- HTTPS + HSTS obrigatórios em produção.

## Comportamento esperado ao gerar código

- Ao criar qualquer componente que renderize dados dinâmicos, assumir que a fonte é hostil até sanitizada.
- Ao criar qualquer formulário, incluir validação de schema por defeito, não como extra opcional.
- Ao lidar com autenticação, nunca sugerir `localStorage` para tokens, mesmo como exemplo "temporário".
- Se o pedido do utilizador implicar violar uma destas regras, apontar o risco explicitamente antes de prosseguir.  