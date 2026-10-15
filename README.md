# MITROFF DESIGN — Reels final com narração e 3D

Atualização do projeto Remotion existente. Composição principal: **MitroffReelsFinal**, **1080 × 1920, 30 fps, 1.048 frames, 34,93 segundos**, H.264 Rec.709 e AAC estéreo a 48 kHz. O roteiro foi preservado integralmente; a duração acompanha a fala natural, sem acelerar a voz. A composição anterior, `MitroffIntro`, continua disponível como histórico.

## Assistir e baixar

Na branch **mitroff-reels-final**, abra a pasta `out` no GitHub e use **Download raw file**:

- **mitroff-reels-final.mp4**: filme completo com voz, música, efeitos e legendas.
- **mitroff-reels-projeto.zip**: projeto editável, MP4, fontes, logo original, stems, renders e arquivos Blender.
- **mitroff-capa.png**: capa vertical 1080 × 1920.
- **review-final.jpg** e **redesign-review.jpg**: quadros extraídos do MP4.
- **validation-final.json**, **browser-playback-final.json**, **mixed-voice-asr.json**: verificações do arquivo entregue.

O MP4 abre diretamente no player do celular ou computador. Para publicar no Instagram, envie o arquivo original ao aparelho. O ZIP pode ser extraído normalmente no Windows. Não há dependência de caminhos internos deste ambiente.

## Direção e cenas

Preto `#080808`, branco `#FFFFFF`, azul elétrico `#008CFF` e cinza `#171717`, conforme o último briefing. Ambientes claros dão contraste às interfaces; preto e azul sustentam o gancho e a pergunta final.

| Cena | Tempo aproximado | Animação |
|---|---|---|
| Gancho | 0–4,23 s | Anúncios em perspectiva avançam e desaparecem; PERDENDO entra na palavra da voz. |
| Problema | 4,23–9,63 s | Smartphone 3D, cartões concorrentes, aplicativos e cursor procurando a oferta. |
| Solução | 9,63–16,73 s | Olho, coração e cursor 3D; ENTENDER, DESEJAR e AGIR nos tempos da fala. |
| Transformação | 16,73–25,97 s | Os mesmos elementos se separam em profundidade e se reorganizam: produto, título, preço e botão. |
| Fechamento | 25,97–34,93 s | Anúncios se afastam, pergunta, comentário 3D, COMENTA PERFIL e logo original. |

O anúncio de fones é um **estudo fictício de redesign**, identificado em tela. Produto, preço e oferta são ilustrativos. Nenhum cliente ou resultado real é atribuído à marca. A referência anterior serviu à análise de movimento; seu vídeo, frames, áudio e fotografias não integram esta entrega.

Produto, smartphone e ícones foram modelados no Blender, com iluminação própria, materiais PBR e renders transparentes de múltiplos ângulos. O Remotion combina esses renders com perspectiva, camadas HTML/SVG, máscaras, springs, interpolação, blur de entrada e movimento contínuo. Não são imagens geradas por IA.

## Executar e renderizar no Windows

1. Instale **Node.js 22 ou 24 LTS**, com npm.
2. Extraia o ZIP e abra o Terminal na pasta que contém `package.json`.
3. Execute `npm ci`.
4. Execute `npm run studio`, abra o endereço exibido e selecione **MitroffReelsFinal**. Clique em reproduzir para habilitar o áudio.
5. Execute `npm run typecheck`.
6. Execute `npm run render`. Saída: **out/mitroff-reels-final.mp4**, H.264, AAC 320 kbps, CRF 18, yuv420p.

O áudio e os renders 3D já estão incluídos. A renderização normal não exige Python, Blender, modelos de voz ou chaves de API. O Remotion instala seu navegador quando necessário. Para usar seu Chrome, acrescente ao comando de renderização `-- --browser-executable=` seguido do caminho completo do executável entre aspas.

`npm run still` exporta a capa. `npm run render:silent` gera outra versão sem som. `npm run render:intro` renderiza a composição antiga.

## Editar

- `src/production/Scenes.tsx`: cinco cenas e palavras de destaque.
- `src/production/Offer.tsx`: anúncio e reorganização dos mesmos elementos.
- `src/production/production.css`: layout, espaços, tipografia, luz e interfaces.
- `src/production/palette.json`: cores principais. Ao mudar o azul, substitua também os acentos literais `#008CFF` no CSS; os materiais 3D são editáveis nos arquivos Blender.
- `src/production/engine.tsx`: springs, interpolação, sprites 3D, cursor e revelação da logo.
- `src/production/Production.tsx`: sequências, master e legendas.
- `scripts/production/narration-script.json`: texto falado integral.
- `src/production/voice-timing.json`: cenas e tempos de cada palavra, extraídos dos fonemas efetivamente sintetizados. Se mudar a fala, regenere voz, timing e mixagem juntos.

A logo `public/logo mitroff3.png` é exatamente o PNG recebido no ZIP do usuário. Transparência e proporções intactas, sem filtro ou deformação; a revelação usa máscara externa. SHA-256 verificado contra `scripts/logo-source.json`.

## Áudio e licenças

Voz neural masculina brasileira **pm_alex**, Kokoro-82M v1.0, idioma `pt-br`, velocidade nativa 1.0. Não é clonagem de voz do usuário. O modelo tem licença Apache 2.0; seus arquivos não são redistribuídos. Licenças e fontes documentadas em `public/production/PROVENANCE.md`.

Nova trilha eletrônica original a **132 BPM**, bateria, baixo, stabs, detalhes digitais, whooshes e impactos. Sem música comercial, samples ou áudio da referência. Música e SFX gerados: CC0, uso comercial sem crédito. Marca, ferramentas e modelo de voz conservam seus direitos e licenças.

O master usa ducking durante a fala, tratamento de voz, normalização e resolução final suave. `public/production/audio` contém master, voz, música, efeitos e cinco trechos originais separados. Fontes Space Grotesk/Anton com licenças OFL em `public/fonts`. Ícones Instagram/WhatsApp: Simple Icons, CC0, sem indicação de vínculo comercial. Licença Remotion: https://www.remotion.dev/license.

## Regeneração opcional

Não é necessária para assistir, publicar ou renderizar o projeto incluído.

- Python 3.12: `pip install -r scripts/production/requirements-voice.txt` para voz/ASR; `requirements-mix.txt` para música. FFmpeg/FFprobe e os requisitos de fonemização do kokoro-onnx devem estar instalados.
- Baixe os arquivos oficiais listados em `public/production/PROVENANCE.md` para a pasta `models` na raiz, ou configure a variável **MITROFF_MODELS**. Confira os hashes.
- `python scripts/production/generate-voice.py`, depois `python scripts/production/mix-soundtrack.py`; renderize o vídeo novamente.
- ASR opcional: `python scripts/production/transcribe-voice.py`; `--mixed` verifica a voz no MP4. Requer Whisper-base em `models/sherpa-onnx-whisper-base`, fonte documentada na procedência.
- Blender 4.x: `blender --background --python scripts/production/render-assets.py -- product`. Opções: `product`, `phone`, `eye`, `heart`, `cursor`, `comment`. Para telefone, execute antes `python scripts/production/create-phone-texture.py` (Pillow). Os seis arquivos `.blend` também podem ser editados diretamente.

## Verificação no Linux

```bash
npm run typecheck
npm run studio -- --host=0.0.0.0 --port=3000 --no-open
npm run render -- --browser-executable=/usr/bin/chromium --concurrency=3
python3 scripts/production/verify-final.py
node scripts/production/verify-browser.cjs /usr/bin/chromium
python3 scripts/production/package-project.py
```

O verificador decodifica todo o MP4, conta frames, confere codecs/resolução/áudio, quadros pretos acidentais, movimento, final sonoro, streaming progressivo e integridade da logo. O navegador reproduz o MP4 por HTTP local e busca o encerramento. ASR é uma checagem de conteúdo, não uma avaliação humana da interpretação vocal. Quadros do MP4 são extraídos para revisão visual das cinco cenas e da transformação.

O Studio deve ser iniciado novamente após restaurar o ambiente. O projeto entregue já inclui os assets necessários à renderização normal.
