# MITROFF DESIGN — V3 inspirada na linguagem da referência

Atualização do projeto existente, com novo roteiro de 20 segundos, interfaces arredondadas, sombras suaves, perspectiva discreta, flutuação contínua, controles que reagem e transições por aproximação. Composição **MitroffIntro**: 1080 × 1920, 30 fps, 600 frames. Trilha instrumental eletrônica original nova, 120 BPM, com sound design e sem narração.

**Esta entrega é uma prévia de movimento: o HEX do azul oficial ainda aguarda confirmação.** O PNG fornecido é preto com transparência, sem azul que possa ser extraído. O valor `#386BFF` da V2 foi mantido como cor de trabalho, não apresentado como azul oficial. Depois da confirmação, atualize `src/brand.ts`, renderize novamente e valide o arquivo final.

## Baixar e visualizar sem programar

Na branch `mitroff-reference-v3`:

- `out/mitroff-intro-v3-preview.mp4`: prévia com H.264 + AAC estéreo incorporado.
- `out/mitroff-projeto-v3.zip`: projeto editável completo, MP4 de prévia, logo, fontes, áudio master/stems e scripts.
- `out/review-v3.jpg`: amostras das seis cenas extraídas do MP4.
- `out/validation-v3.json` e `out/browser-playback-v3.json`: verificações técnicas do arquivo.

No GitHub, abra o arquivo e use **Download raw file** (seta para baixo). Se necessário, entre na conta com acesso ao repositório. O ZIP pode ser extraído no Windows e o MP4 pode ser aberto diretamente no player. As versões anteriores continuam nas branches `mitroff-logo-audio` e `mitroff-motion-v2`.

## O que mudou

- A referência foi analisada antes das mudanças; veja `REFERENCE_NOTES.md`. Não reutilizamos suas marcas, fotos, textos, ícones, frames ou áudio.
- Cards ganham conteúdo, se reorganizam e mantêm movimento em perspectiva. Os glows e sombras acompanham as camadas.
- Um controle de identidade se transforma em interface; a cena DESIGN aproxima a câmera para entrar na edição.
- O editor tem preview, inspetor, cortes, playhead e faixas gráficas. A landing page se monta, recebe clique e se transforma para mobile continuamente.
- Na mensagem MAIS PRESENÇA., as peças anteriores convergem, preparando a logo final.
- A logo original está na abertura e no encerramento. `public/logo mitroff3.png` permanece intacto; o SHA-256 é verificado por script. Usa-se o alfa sobre branco, sem redesenho, filtros ou deformação.
- Os layouts são conceitos autorais, não trabalhos atribuídos a clientes ou resultados fictícios.

## Executar e renderizar no Windows

1. Instale **Node.js 22 ou 24 LTS**, com npm.
2. Extraia o ZIP e abra o Terminal na pasta com `package.json`.
3. Execute `npm ci`.
4. Execute `npm run studio`; abra o endereço exibido e selecione **MitroffIntro**. Clique para iniciar caso o navegador bloqueie áudio automático.
5. Execute `npm run typecheck`.
6. Execute `npm run render`. Saída atual: `out/mitroff-intro-v3-preview.mp4`, H.264, AAC 320 kbps, CRF 18.
7. Frame do encerramento: `npm run still`. Exportação sem som: `npm run render:silent`, em arquivo separado.

O Remotion obtém seu navegador quando necessário. Alternativa com Chrome instalado:

`npm run render -- --browser-executable="C:\Program Files\Google\Chrome\Application\chrome.exe"`

A renderização normal usa o WAV incluído e não exige Python ou FFmpeg separado. Confira a prévia do Reels no aparelho, pois a interface varia. Títulos e logo ficam dentro de margens laterais de segurança; as linhas decorativas podem chegar às bordas.

## Editar

- `src/brand.ts`: cor, logo e conteúdo principal. O HEX oficial deve ser confirmado pelo usuário.
- `src/scenes/`: seis cenas editáveis. Algumas palavras funcionais das interfaces estão nesses componentes.
- `src/components/InterfaceMotion.tsx`: flutuação contínua, títulos, cursor, traçados, arte autoral, logo e portals.
- `src/components/Motion.tsx`: curvas, spring e carregamento das fontes locais.
- `src/style.css`: acabamento e layout; a cor de destaque também é usada por `color-mix()` nos glows.
- `scripts/audio-cues.json`: roteiro e cues compartilhados entre animação e áudio.
- `public/audio/`: master, música e efeitos separados. Os WAVs gerados são CC0, para uso comercial sem atribuição; a licença não abrange direitos sobre a marca ou dependências.

Para regenerar o áudio, opcionalmente instale Python, numpy, scipy e FFmpeg e execute `python scripts/generate-audio.py`. Não há samples ou chaves de API. Anton e Space Grotesk estão incluídas localmente com licenças OFL em `public/fonts/`.

## Roteiro

| Cena | Frames (fim exclusivo) | Conteúdo |
|---|---|---|
| 1 | 0–90 | Logo original / MITROFF; traçados viram controle de interface |
| 2 | 90–210 | DESIGN; composições em perspectiva se reorganizam |
| 3 | 210–330 | EDIÇÃO; zoom, preview, timeline e cortes |
| 4 | 330–450 | LANDING PAGES; montagem, clique e transformação responsiva |
| 5 | 450–540 | MAIS PRESENÇA.; convergência das peças |
| 6 | 540–600 | Logo original; brilho discreto e resolução musical |

A trilha a 120 BPM permite alinhar as mudanças de cena ao roteiro em segundos inteiros. A música tem novos graves, stabs, bateria e sequência melódica; impactos e sons de interface acompanham o cue sheet. Os ataques se retiram perto do fim e uma resolução em 19 s deixa a cauda chegar suavemente a 20 s.

## Verificação no ambiente Linux

`npm ci --cache /tmp/mitroff-npm --no-audit --no-fund`

`npm run typecheck`

`npm run studio -- --host=0.0.0.0 --port=3000 --no-open`

`npm run render -- --browser-executable=/usr/bin/chromium --concurrency=2`

`python3 scripts/verify-output.py`: exige numpy e FFmpeg/FFprobe; conta frames, decodifica vídeo e áudio, verifica níveis, final suave, streaming e hash do PNG.

`node scripts/verify-browser.cjs`: verifica reprodução real e busca para 18 s no Chromium, via HTTP local. Aceita o executável do navegador como primeiro argumento.

A validação técnica da prévia não confirma a cor oficial nem representa publicação no Instagram. O Studio precisa ser reiniciado após restaurar o ambiente. Licença do Remotion: https://www.remotion.dev/license.
