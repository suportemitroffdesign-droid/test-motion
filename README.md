# MITROFF DESIGN — Motion V2

Nova direção do **mesmo projeto Remotion**: preto, branco e azul, títulos centrais, tipografia cinética, peças em camadas, cortes na batida e interface responsiva. Composição **MitroffIntro**, 1080 × 1920, 30 fps, 600 frames / 20 s. Música original mais energética a 150 BPM e efeitos incorporados ao MP4, sem narração.

## Baixar e publicar sem executar código

Na branch `mitroff-motion-v2` deste repositório:

- `out/mitroff-intro-v2.mp4` — novo vídeo final, H.264 + AAC estéreo.
- `out/mitroff-projeto-v2.zip` — pacote completo com MP4 pronto, fontes do projeto, logo original, fontes tipográficas licenciadas, master de áudio, stems e gerador.
- `out/review-v2.jpg` — amostras do vídeo efetivamente renderizado.
- `out/validation-v2.json` e `out/browser-playback-v2.json` — evidências de validação do arquivo.

Abra o arquivo no GitHub e clique em **Download raw file** (seta para baixo). Se o repositório for privado, entre na conta com acesso. O ZIP pode ser extraído pelo Windows. O MP4 já contém toda a trilha e os efeitos: basta abrir no player e enviar ao Reels. A versão anterior continua disponível na branch `mitroff-logo-audio`.

## Direção e identidade

- Fundo varia entre preto, papel branco e azul; não há longa sequência de fundo preto vazio.
- Uma palavra principal por cena, exceto o serviço LANDING PAGES em duas linhas e as três palavras sucessivas de posicionamento.
- Fontes **Anton** e **Space Grotesk**, incluídas localmente e aguardadas antes do render. Licenças SIL Open Font License incluídas em `public/fonts/`; não há download de fontes durante o vídeo.
- Azul editável em `src/brand.ts`: `#386BFF`, retomado da referência inicial do projeto. O PNG oficial é monocromático e não determina um HEX azul oficial. Se houver manual de identidade, substitua pelo HEX correspondente.
- `public/logo mitroff3.png` é o PNG original recebido no ZIP, preservado byte por byte. O hash está em `scripts/logo-source.json`. A imagem usa corretamente o alfa sobre o fundo branco da cena inteira; não está numa placa de cor diferente. Todas as letras, proporções e formas são preservadas, sem filtros ou redesenho.
- A marca oficial é revelada por máscara e movimento uniforme a partir de 16 s, ficando inteira e legível por cerca de 3 s no final.
- Os layouts apresentados são estudos autorais, não portfólio atribuído a clientes ou marcas fictícias.

## Executar e renderizar no Windows

1. Instale **Node.js 22 ou 24 LTS** (inclui npm).
2. Extraia o ZIP. Na pasta com `package.json`, clique com o botão direito e selecione **Abrir no Terminal**.
3. Execute `npm ci`.
4. Execute `npm run studio`; abra o endereço exibido e escolha **MitroffIntro**. Clique para reproduzir caso o navegador bloqueie áudio automático.
5. Execute `npm run typecheck`.
6. Execute `npm run render`; aguarde o término. Saída: `out/mitroff-intro-v2.mp4`, com H.264, AAC 320 kbps e CRF 18.
7. Para imagem final: `npm run still`. Para versão silenciosa em outro arquivo: `npm run render:silent`.

O navegador de renderização é obtido pelo Remotion quando necessário. Alternativa com Chrome instalado:

`npm run render -- --browser-executable="C:\Program Files\Google\Chrome\Application\chrome.exe"`

Não precisa de Python ou FFmpeg separado para o render normal: o master WAV pronto já está incluído. Confira a prévia do Instagram no seu aparelho, pois a interface pode variar. Os títulos e logo têm margens laterais seguras; detalhes decorativos podem avançar até as bordas.

## Editar

- `src/brand.ts`: títulos, palavras de posicionamento, cores e logo.
- `src/scenes/`: seis cenas separadas e editáveis.
- `src/components/Motion.tsx`: spring, máscaras por letra, blur óptico nas entradas, grid e wipes.
- `src/style.css`: layouts e acabamento visual.
- `scripts/audio-cues.json`: **única fonte dos tempos**, importada em `src/timing.ts` e lida pelo gerador de áudio. Atualize também as durações da composição caso mude o roteiro total.
- `public/audio/mitroff-master.wav`: nova mixagem pronta. `music.wav` e `sfx.wav`: stems para remixar.

Para regenerar o áudio, opcionalmente instale Python, numpy, scipy e FFmpeg e execute `python scripts/generate-audio.py`. Toda a síntese é original, sem samples externos; os WAVs são disponibilizados sob CC0, para uso comercial sem atribuição. Veja `public/audio/PROVENANCE.md`. A licença de áudio não transfere direitos sobre a marca nem altera as licenças das dependências.

## Timeline

| Cena | Frames (fim exclusivo) | Movimento |
|---|---|---|
| MITROFF | 0–72 | Entrada por letras, escala, linhas azuis e contornos |
| DESIGN | 72–168 | Peças entram em direções diferentes e se reorganizam |
| VÍDEOS | 168–264 | Cortes, alternância de painéis, barras e timeline na batida |
| LANDING PAGES | 264–360 | Interface montada em camadas; desktop vira mobile continuamente |
| Posicionamento | 360–456 | CRIATIVIDADE → MOVIMENTO → PRESENÇA; fundos e formas mudam |
| Logo oficial | 456–600 | Sweep azul, revelação da marca, acabamento sobre branco |

150 BPM equivale a 12 frames por batida. Transições e entradas principais usam essa grade. As palavras de posicionamento entram em 360, 396 e 432; a logo em 480. A resolução musical ocorre em 540, retirando os ataques e deixando a cauda terminar suavemente.

## Validação no ambiente usado

`npm ci --cache /tmp/mitroff-npm --no-audit --no-fund`

`npm run typecheck`

`npm run studio -- --host=0.0.0.0 --port=3000 --no-open`

`npm run render -- --browser-executable=/usr/bin/chromium --concurrency=2`

`python3 scripts/verify-output.py` — usa FFmpeg/FFprobe e numpy: conta os 600 frames, decodifica vídeo e áudio completos, mede volume/pico e verifica o hash da logo.

`node scripts/verify-browser.cjs` — reproduz o MP4 real no Chromium e verifica avanço de tempo, frames decodificados e busca para 18 segundos. Por padrão usa `/usr/bin/chromium`; aceita outro executável como primeiro argumento.

O Studio precisa ser reiniciado ao restaurar o ambiente. A validação técnica e a revisão visual não equivalem a uma publicação no Instagram. Remotion e dependências mantêm suas próprias licenças: https://www.remotion.dev/license.
