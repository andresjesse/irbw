# irbw

IrrRPG Builder 2.0 - WebGL

# Setup

`$ yarn`

# Run (Development Webpack Server)

`$ yarn start`

# Deploy (gh-pages)

`$ yarn build-production`
`git add & commit`
`$ yarn deploy`

# Technical Preview

https://andresjesse.github.io/irbw/index.html

# Immediate TODO:List

- Add one more bioma for testing purpose.
- fix shadowmap translation (neighbor segments aren't affected when time of day changes)

  - existe outro problea: o shadowmap é gerado global, objetos distantes (mesmo fora do alcance da camera) diminuem a resolucao geral
  - verificar outros algoritmos. PSSM talvez resolva.

- testar thin instances. ainda existem problemas de render. possivelmente causados pelo loop do JS (não é gráfico, fps fica baixo mesmo sem nada na tela)

- explorar exporter blender;
  - poucas configs. desabilitei material PBR
- trabalhar na escala dos objetos, considerar humano com altura max 2.

- alterei a posicao da camera, agora distante em 20 unidades. ajustar escalas do shader!
- alterei o tamanho do segmento para 100 e dobrei a resolucao (melhor ter segmentos maiores já no início do projeto)
  - 100x100m é uma boa área. ajustar parâmetros do shader.
