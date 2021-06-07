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

- continuar implementando save/restore userData.

  - OK lightManager
  - OK terrain:
    - segments << testar >>
  - OK armazenar Scripts no JSON (e carregar a partir dele)
  - atualizar o tema "white" do editor
  - deixar o Script index 0 selecionado por padrão (para evitar mostrar um editor dummy)

- limpar comments antigos em VegetationSegment

- implementar editor: https://github.com/codemirror/codemirror.next/
  - tratar como Unity:
    - scripts ficam em um repositório do projeto (não vinculados à um objeto específico)
    - DynamicObjects possuem apenas um script de inicialização:
      - um select mostra todos os scripts disponíveis => usuário escolhe ScriptX;
      - logo abaixo aparecem campos (tipo Inspector) para inicialização do objeto => isso é usado no construtor do ScriptX quando o game executa.
      - internamente, o script acessa e modifica o "live object" (transform, atributos, etc do editor são preservados e resetados depois que o game encerra - retorno ao editor)
