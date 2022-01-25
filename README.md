# La dApp de Leaf avec l'interface Owner

## Description de la dapp
- Le deroulement d'un joueur d'un player
  - achete un LNFT Grain pour devenir joueur avec level_0
  - fais 10000 pas et devien level 1 et recoie deuzieme LNFT Jeune Pousse
  - fais 20000 pas et devien level 2 et recoie troisiemme LNFT Arbre
  - fais 30000 pas et devien level 3 et recoie quatriemme LNFT Arbre Producteur
  - apres 30000 pas chaque 10000 pas va etre remunerer 10 LEAFs
  - il peut recuperer les donner consernant lui(dernier nombre pas, total nombres pas, url ses NFTs, son balance) 
  - il peut recuperer les donner globale comme supply de LNFTs et LEAFs 
 
 - Fonctionalites de owner
    - recuperel les donnes de joueurs
  - mettre le dapp en pause
  - passer le dapp en mode test
  - changer le prix de LNFT
  - mettre un joueur dans la liste noir
  - voir les donner global comme supply de LNFTs et LEAFs.
  - voir/recuperer les ETH qui sont present dans dapp

## La documentations génerer sur ipfs.io pour chaque contracts
- [LeafToken_README.md](https://ipfs.io/ipfs/QmQrJhTsEgLgkqSL3nhSLFqceXJczfZzSfTy3NMsWhQdEn)
- [LeafNft_README.md](https://ipfs.io/ipfs/QmdoCigjx7EiGb1wid6BHmaZk9iqwWq3qoR6PxwVEatH3W)
- [LeafDapp_README.md](https://ipfs.io/ipfs/QmfYCzzauCN6iYpsvHAJ74WisGv6HWVZcTqz2WRyqUFYkK)

## Installation/exécution de la dApp
- sur le dossier parent
  - `npm install`
  - `truffle migrate --reset --network NomReseau`
- sur le dossier client
  - `npm install`
  - `npm run start`
  
## Tester la dApp
- REMARQUE : a cause des conflits de node_modules j'ai enlevé `@openzeppelin/test-helpers` donc il faut installer
  `npm install @openzeppelin/test-helpers --save`
- `truffle test`
