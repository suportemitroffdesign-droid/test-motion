# Revisão da produção final

Amostras extraídas do MP4 entregue, após conversão para Rec.709, em `review-final.jpg`, `redesign-review.jpg` e `transitions-review.jpg`.

- Abertura: o frame 0 já contém anúncios tridimensionais, sem espera em fundo vazio. Entre 0 e 40, cartões avançam com perspectiva e os objetos giram. PERDENDO e CLIENTES permanecem inteiros dentro das margens.
- Problema: smartphone e cartões em profundidade, cursor de busca e ícones reconhecíveis. A concorrência de informação é intencional no anúncio anterior ao redesign; a mensagem principal BONITO ≠ EFICIENTE permanece separada e legível.
- Solução: olho, coração e cursor são renders 3D originais. Corrigidos artefatos de malha/parenting durante a produção. Os três rótulos ficam legíveis e o cursor de clique não encobre AGIR.
- Transformação: os frames 502, 545, 575, 625, 680 e 738 mostram a mesma oferta passando de hierarquia confusa para título, produto, preço e botão claros. Os elementos se movem individualmente; não é uma troca de duas imagens estáticas. Sobreposições de trabalho pertencem à etapa de reorganização; o estado final não corta produto, preço ou CTA.
- Fechamento: a pergunta se mantém dentro das margens, seguida pelo comentário 3D e COMENTA PERFIL. A logo original aparece com alfa sobre branco, sem filtros, redesenho ou alteração de proporções. O final mantém a identidade, com resolução musical e decaimento de áudio.
- Legendas: grupos de até três palavras, sincronizados com as durações reais dos fonemas. O aparecimento de cada grupo leva dois frames. As legendas terminam após a fala e não cobrem a logo final.

A decodificação integral de vídeo e áudio, formatos, resolução, duração, níveis, ausência de quadros pretos acidentais e integridade do PNG foram verificados por `verify-final.py`. Os quadros de título têm pausas breves de leitura; a imobilidade mais longa pertence ao encerramento intencional da marca.

O reconhecimento independente do áudio mixado recuperou os cinco parágrafos completos. As diferenças de transcrição foram pontuação, capitalização e normalizações como “pra” para “para” e “pro” para “para o”, sem mudança de conteúdo. Não foi fornecido o roteiro como dica ao reconhecedor. A conversão de cor copiou o AAC sem recodificação; o hash do bitstream é igual antes/depois (`audio-integrity-final.json`).

A revisão visual foi feita por quadros e sequências extraídas; não se apresenta ASR como avaliação humana de interpretação vocal. A reprodução real do arquivo no Chromium e a busca no encerramento são registradas separadamente em `browser-playback-final.json`.
