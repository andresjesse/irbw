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

- VegetationPaint:

  - isolate instance selection logic (switch-case) from instantiate method;
  - avoid to create new meshes: use hardware instancing or even thin instances

- falar sobre preloading: containers, meshes (material automatico em ambos os casos)
- upgraded babylon version: yarn upgrade @babel/core
- AssetContainer bug. .instantiateModelsToScene(); // ALWAYS CLONING! Discussion here: https://forum.babylonjs.com/t/assetcontainer-instantiatemodelstoscene/6388/12
- testar thin instances:
  - instancedMesh entra no loop do JS!
  - thin não!
    - problema da thin é que a adição/remoção é mais lenta que instancedMesh. Pode ser idal para gameplay, mas no editor talvez não.
    - trabalha com matrix, pode ser mais complexo de implementar.
