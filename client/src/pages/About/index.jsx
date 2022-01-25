import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import styled from 'styled-components'
import { Link } from 'react-router-dom'
import colors from '../../utils/style/colors'
import { Loader } from '../../utils/style/Atoms'
import { useFetch, useTheme } from '../../utils/hooks'
import tree from '../../assets/img/tree.png'

const PageTitle = styled.h1`
  font-size: 30px;
  text-align: center;
  padding-bottom: 30px;
  color: ${({ theme }) => (theme === 'light' ? '#000000' : '#ffffff')};
`

const PageSubtitle = styled.h2`
  font-size: 20px;
  color: ${colors.secondary};
  font-weight: 300;
  text-align: center;
  padding-bottom: 30px;
  color: ${({ theme }) => (theme === 'light' ? '#000000' : '#ffffff')};
`

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
`

function About() {
  const { theme } = useTheme()

  return (
    <div>
      <PageTitle theme={theme}>About</PageTitle>
      <PageSubtitle theme={theme}>  
        <div className="about">
          <div className="whiteBox">
            <h1>MOVE-TO-EARN</h1>
            <p>
              Votre arbre génère de la cryptomonnaie $LEAF lorsque vous marchez.
            </p>
          </div>
          <div className="greenBox">
            <h1>PLAY-TO-PLANT</h1>
            <p>
              Une partie de vos efforts permet de créer des $LEAF reversés pour la reforestation.
            </p>
          </div>
          <div className="whiteBox">
            <h1>SCORING</h1>
            <p>
              Suivez votre classement sur le LEADERBOARD et consultez le nombre d’arbres vous avez planté.
            </p>
          </div>

          <div className="greenBox">
            <h1>LEVEL</h1>
            <p>
              Relevez les défis du contrat de marche et votre arbre produira de plus en plus de $LEAF.
            </p>
          </div>
          <div className="whiteBox">
            <h1>MARKETPLACE</h1>
            <p>
              Usez de stratégie et achetez des Ressources au bon moment pour booster la production de  $LEAF de votre arbre.
            </p>
          </div>
          <div className="greenBox">
            <h1>NFT</h1>
            <p>
              Vous êtes assidu ?<br />
              Votre arbre va produire un fruit qui donnera naissance à un nouvel arbre.
            </p>
          </div>
        </div>
      </PageSubtitle>
    </div>
  )
}

export default About
