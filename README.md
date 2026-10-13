# MITROFF DESIGN — Motion intro com logo oficial e áudio

Atualização do projeto existente. Composição **MitroffIntro**: 1080 × 1920, 30 fps, 600 frames, 20 segundos. MP4 com vídeo H.264 e áudio AAC estéreo. Seis cenas de motion editorial, identidade monocromática, PNG original e trilha eletrônica original com efeitos sincronizados.

## Baixar e publicar, sem programar

Na branch `mitroff-logo-audio` do repositório, abra:

- `out/mitroff-intro.mp4` — vídeo final com música e efeitos incorporados.
- `out/mitroff-projeto.zip` — pacote completo: MP4 pronto, projeto editável, logo original, áudio master, stems e gerador.

No GitHub, use **Download raw file** (ícone de seta para baixo). Se o repositório for privado, entre na conta com acesso. O ZIP pode ser extraído normalmente no Windows. O vídeo pode ser aberto no player do Windows e enviado ao Instagram Reels; não depende de outro arquivo de áudio. Não é necessário executar o projeto para publicar o MP4.

## Logo e identidade

`public/logo mitroff3.png` é o arquivo original extraído do ZIP enviado pelo usuário, sem alterações nos bytes. A logo preta é exibida sobre uma base branca para manter contraste. O canal alfa e todas as letras, formas e proporções permanecem intactos. O layout esconde apenas a grande margem transparente do PNG, sem cortar a área visível da marca. Não há filtros, redesenho, IA ou placeholder.

A revelação da logo ocorre a partir de 15,83 s, por uma máscara horizontal e um movimento suave da base. A marca inteira permanece visível por mais de 2 segundos ao final. A identidade usa preto e branco; o azul provisório foi removido.

## Executar e renderizar no Windows

1. Instale **Node.js 22 ou 24 LTS**, que inclui npm.
2. Extraia `mitroff-projeto.zip`. Na pasta com `package.json`, clique com o botão direito e escolha **Abrir no Terminal**.
3. Execute `npm ci` (só na primeira instalação ou quando atualizar dependências).
4. Execute `npm run studio`. Abra o endereço exibido e selecione **MitroffIntro**. A prévia inclui áudio; se o navegador bloquear reprodução, clique para iniciar.
5. Execute `npm run typecheck` para validar TypeScript.
6. Execute `npm run render`. Aguarde o término. Saída: `out/mitroff-intro.mp4`, com H.264 + AAC a 320 kbps, CRF 18.
7. Sem áudio, se desejar: `npm run render:silent` (saída separada: `out/mitroff-intro-silent.mp4`).
8. Frame da assinatura: `npm run still`.

O Remotion obtém seu navegador de renderização automaticamente quando necessário. Alternativa com Chrome instalado: `npm run render -- --browser-executable="C:\Program Files\Google\Chrome\Application\chrome.exe"`. FFmpeg separado não é necessário para a renderização normal do Remotion. Os WAVs prontos estão no ZIP; Python não é necessário para executar ou renderizar o projeto.

## Editar

- `src/brand.ts`: textos, paleta e caminho da logo.
- `src/MitroffIntro.tsx`: seis componentes de cena e movimentos existentes. Usa `Sequence`, `interpolate()` e `spring()`; não depende do relógio real ou de aleatoriedade durante o render.
- `src/style.css`: grid, tipografia e espaçamento.
- `src/timing.ts`: tempos de entradas, revelação e transformação mobile.
- `scripts/audio-cues.json`: efeitos posicionados em frames. Ao alterar tempos, mantenha este arquivo e `timing.ts` coerentes e regenere o áudio.
- `public/audio/`: master e stems de música/efeitos, estéreo a 48 kHz. Leia `PROVENANCE.md` para origem e licença CC0 do áudio gerado. Não há narração ou música comercial.

Para remixar, use `music.wav` e `sfx.wav` no editor de áudio de sua preferência. Para regenerar a síntese, opcionalmente instale Python, `numpy`, `scipy` e FFmpeg; execute `python scripts/generate-audio.py`. O gerador não usa rede, samples externos ou chaves de API.

## Roteiro e sincronização

| Cena | Frames (fim exclusivo) | Conteúdo |
|---|---|---|
| 1 | 0–90 | Esse perfil estava quieto demais; efeitos nas entradas 4, 11 e 18 |
| 2 | 90–150 | Resolvi começar pelo que sei fazer; transição para formas |
| 3 | 150–250 | DESIGN; impacto, peças em camadas e detalhes digitais |
| 4 | 250–350 | EDIÇÃO DE VÍDEO; cortes em 250, 275, 300 e 325 |
| 5 | 350–450 | LANDING PAGES; montagem e desktop para mobile |
| 6 | 450–600 | Lucas, logo original; revelação em 475 e resolução musical em 525 |

A grade musical usa 144 BPM, ou 12,5 frames por batida. Títulos em 150, 250 e 350 coincidem com essa grade; efeitos acompanham também as entradas individuais entre batidas. O final retira novos ataques, resolve a harmonia e deixa a cauda decair suavemente.

Margens principais de 96 px, topo e rodapé reservados à interface do Reels. Confira a prévia do Instagram antes de publicar, pois a interface varia por aparelho. Os layouts de design e landing page são estudos autorais identificados, sem marcas clientes ou afirmações de portfólio real.

## Validação e ambiente Linux

`npm ci --cache /tmp/mitroff-npm --no-audit --no-fund`

`npm run typecheck`

`npm run studio -- --host=0.0.0.0 --port=3000 --no-open`

`npm run render -- --browser-executable=/usr/bin/chromium --concurrency=2`

`python3 scripts/verify-output.py` (precisa de FFmpeg/FFprobe e numpy; valida o MP4 real, áudio e hash da logo).

Resultado da execução atual: `out/validation.json`. O MP4 foi decodificado integralmente para verificar vídeo e áudio. A validação não substitui a revisão artística no seu aparelho nem representa uma publicação no Instagram. O Studio deve ser reiniciado quando o ambiente for restaurado.

Remotion e dependências têm licenças próprias: https://www.remotion.dev/license.
