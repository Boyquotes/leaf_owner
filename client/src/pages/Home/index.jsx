import React from 'react';
import ReactDOM from 'react-dom';

import styled from 'styled-components'
import colors from '../../utils/style/colors'
import { StyledLink } from '../../utils/style/Atoms'
import { useTheme } from '../../utils/hooks'
import arbre2 from '../../assets/img/arbre2.png'

const HomeWrapper = styled.div`
  display: flex;
  justify-content: center;
`

const HomerContainer = styled.div`
  margin: 3em;
  padding: 60px 90px;
  display: flex;
  flex-direction: row;
  max-width: 1400px;
`

function Home() {
  const { theme } = useTheme()

  return (
    <HomeWrapper>
      <HomerContainer theme={theme}>
      <div className="appP2P">
        <div>
          <h1>PLAY 2 PLANT</h1>
          <h2>The Leaf project</h2>
          <p>
            Play 2 Plant est un jeu mobile créé pour contribuer à la reforestation en incitant ses joueurs à faire de l’activité physique. 
            Notre jeu permet à l’utilisateur de gagner de la crypto-monnaie $LEAF et de planter des arbres lorsqu’il marche. Pour jouer, vous devez posséder un des 10.000 NFT.
          </p>
        </div>
        <div>
            <img src={arbre2} />
        </div>
      </div>
      </HomerContainer>
    </HomeWrapper>
  )
}

export default Home
