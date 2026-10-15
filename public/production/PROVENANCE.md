# Procedência da produção final

## Marca e identidade

`../logo mitroff3.png`: PNG original recebido em `logo mitroff3.zip`, preservado byte a byte. SHA-256: `12a6cd96469bdf43186efd4b30d5b644a1a4f3e04d8e05d675d095bd5fa17be0`. Direitos da marca pertencem ao titular. As cores `#080808`, `#FFFFFF`, `#008CFF`, `#171717` foram especificadas no último briefing.

## Visuais

Produto, smartphone, olho, coração, cursor e comentário foram construídos proceduralmente neste projeto e renderizados no Blender 4.3.2 / Cycles, com iluminação própria. `scripts/production/render-assets.py` é a fonte editável, além dos seis arquivos `.blend`. Os PNGs transparentes são renders desses objetos. Não se utilizou geração de imagens por IA, assets de clientes, pessoas, fotografias ou material visual da referência. O anúncio é fictício e identificado como estudo de redesign.

SVGs de Instagram e WhatsApp: https://github.com/simple-icons/simple-icons/tree/develop/icons , CC0; licença em `licenses/SIMPLE-ICONS-CC0.md`. Não representam patrocínio ou vínculo com os aplicativos.

## Voz

Inferência local com kokoro-onnx 0.6.1 / Kokoro-82M v1.0, voz masculina brasileira `pm_alex`, `pt-br`, velocidade 1.0. Sem pitch shift, atempo ou aceleração. Roteiro integral em `scripts/production/narration-script.json`. Tempos das palavras vêm dos fonemas efetivamente sintetizados. Arquivos do modelo não estão incluídos.

Modelo original: https://huggingface.co/hexgrad/Kokoro-82M . Licença Apache 2.0, cópia em `licenses/KOKORO-APACHE-2.0.txt`. Implementação ONNX: https://github.com/thewh1teagle/kokoro-onnx . Downloads oficiais utilizados:

- https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/kokoro-v1.0.onnx — SHA-256 `beb0d1848dee9a49da392cc3df26958d46cfa35d321edf434f52949153f0df3a`.
- https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin — SHA-256 `bca610b8308e8d99f32e6fe4197e7ec01679264efed0cac9140fe9c29f1fbf7d`.

Whisper-base via sherpa-onnx foi usado para checar o conteúdo da voz, sem fornecer o texto ao reconhecedor. Não é fonte da narração. Modelos de validação não estão incluídos; fonte: https://github.com/k2-fsa/sherpa-onnx/releases/tag/asr-models .

## Música e efeitos

Composição instrumental a 132 BPM e sound design gerados por `scripts/production/mix-soundtrack.py` com osciladores, envelopes, ruído filtrado e síntese FM. Sem samples ou música comercial de terceiros. `music-bed.wav` e `sound-design.wav`: CC0 1.0 Universal, na medida dos direitos aplicáveis — https://creativecommons.org/publicdomain/zero/1.0/legalcode . Uso comercial sem atribuição. Esta declaração não concede direitos sobre a marca, dependências ou modelo de voz.

`final-mix.wav` contém narração, música e efeitos. `mix-report.json` registra eventos e medidas. As ferramentas e modelos conservam suas licenças; não se reivindica exclusividade sobre voz de modelo público.
