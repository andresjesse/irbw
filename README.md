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

- upgraded babylon version: yarn upgrade @babel/core
- AssetContainer bug. .instantiateModelsToScene(); // ALWAYS CLONING! Discussion here: https://forum.babylonjs.com/t/assetcontainer-instantiatemodelstoscene/6388/12
