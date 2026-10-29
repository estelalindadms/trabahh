# O Recife sujo

Um ensaio fotográfico e poético em 16 fotografias de arquivo, com linguagem gráfica inspirada na xilogravura, quatro sextilhas e música instrumental de fundo.

## Editar a base

- A página está em `index.html`.
- Os dados das 16 fotos e os quatro poemas estão em `data.js`.
- As imagens estão em `assets/recife-01.jpg` até `recife-16.jpg`.
- O visual e o tratamento monocromático na exibição estão em `styles.css`.
- Os controles da galeria, a leitura automática e o áudio estão em `app.js`.

Para substituir pelas fotografias inéditas da equipe, troque os 16 arquivos e atualize as descrições, fontes, nomes dos autores e datas em data.js e assets/credits.json. As fotos atuais são exemplos reais de Recife provenientes de Pexels e Wikimedia Commons, de diversos períodos, com créditos e licenças identificados. Não comprovam o estado atual dos locais.

As fotos recebem tratamento monocromático somente na exibição do ensaio. A galeria ampliada usa os arquivos em suas cores originais; algumas imagens originais podem já ser monocromáticas. As fotografias não são xilogravuras artesanais.

## Música e leitura

A música em `assets/trilha-demo.wav` é uma composição digital original de demonstração, não uma gravação dos artistas pesquisados. A leitura utiliza a voz de português disponível no navegador, quando suportada. Substitua pelo registro sonoro final do grupo e atualize os créditos para a entrega acadêmica.

## Abrir e apresentar

Sirva a raiz deste projeto com um servidor HTTP. Não há instalação de pacotes nem etapa de compilação. O site funciona em telas de computador e celular e oferece uma galeria com as 16 fotos, navegação por teclado, controle de volume e pausa da música.

## Licenças

As licenças individuais das fotos estão em `assets/credits.json` e no próprio site. A fonte Alfa Slab One é distribuída sob SIL Open Font License 1.1, incluída em `assets/OFL-AlfaSlabOne.txt`.

## Recife vivo e identidade visual

O quarto movimento reúne quatro registros de arte e convivência e permite devolver a cor às imagens. A linha-matriz que atravessa um rio, forma uma ponte e se ramifica foi desenhada especialmente para esta base em `assets/linha-matriz.svg`. O cartaz do curta também é um desenho original em SVG, em `assets/curta-poster.svg`.

O refinamento visual e os controles de acesso estão em `enhancements.css` e `enhancements.js`. O painel oferece texto maior, contraste reforçado, retirada de texturas, redução de movimento, cores originais e fonte simples. As preferências são salvas somente no navegador. A leitura tem controles de pausa, retomada e parada.

## Espaço para o curta

O curta está identificado como em produção: não há um vídeo fictício. O roteiro e as propostas de produção própria estão em `assets/roteiro-a3.txt` e no site.

Para publicar o filme, preencha os campos `shortFilm` em `data.js`: `src` para o MP4, `captionsSrc` para as legendas WebVTT finais, `transcript` para a transcrição real e `audioDescriptionSrc` para uma versão do vídeo com audiodescrição. Os recursos só aparecem quando seus respectivos campos são preenchidos. Use caminhos de arquivos reais, colocados dentro de `assets/`.
## GitHub Pages

Esta cópia contém o site diretamente na raiz do repositório e usa caminhos relativos, compatíveis com uma publicação de projeto em GitHub Pages.

Em Settings > Pages, selecione Deploy from a branch, a branch main e a pasta / (root). O arquivo .nojekyll mantém a publicação estática, sem etapa de compilação.

O endereço canonical da hospedagem anterior foi retirado. Depois de conhecer a URL definitiva do GitHub Pages, adicione essa URL no head de index.html, se desejar.

Para testar localmente com Python, execute python -m http.server 8000 na raiz do projeto e abra http://localhost:8000. A publicação online não depende desse servidor nem dos arquivos permanecerem no computador.
