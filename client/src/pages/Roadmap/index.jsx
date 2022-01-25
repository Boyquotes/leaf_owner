import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import styled from 'styled-components'
import { Link } from 'react-router-dom'
import colors from '../../utils/style/colors'
import { Loader } from '../../utils/style/Atoms'
import { useFetch, useTheme } from '../../utils/hooks'
import tree from '../../assets/img/tree.png'

const CardsContainer = styled.div`
  display: grid;
  gap: 24px;
  grid-template-rows: 350px 350px;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  justify-items: center;
`

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

function Roadmap() {
  const { theme } = useTheme()

  return (
    <div className="roadmap">
      <PageTitle theme={theme}>ROADMAP</PageTitle>
      <PageSubtitle theme={theme}>
            <hr></hr>
            <h2>Décembre 2021 - Janvier 2022</h2>
            <h2>POC</h2>
            <ul>
                <li>Concept <i>13 décembre 2021</i></li>
                <li>Business plan</li>
                <li>White paper</li>
                <li>NFT</li>
                <li>DAPP</li>
                <li>TOKEN</li>
                <li>POC</li><i>27 janvier 2022</i>
            </ul>
            <hr></hr>
            <h2>Q1/Q2 2022</h2>
            <h2>LEAF Company</h2>
            <ul>
                <li>Communication (Site web/réseaux sociaux/Discord/Twitter) <i>Q1/Q2</i></li>
                <li>Constitution de la LEAF company <i>Q1/Q2</i></li>
                <li>Choix/partenariat avec l'association <i>Q1/Q2</i></li>
            </ul>
            <hr></hr>
            <h2>Q3 2022</h2>
            <h2>Teasing</h2>
            <ul>
                <li>Lancement de l'opération marketing</li><i>1 juillet 2022</i>
                <li>Développements ++ (NFT asso/niveaux/marketplace/rareté)</li><i>Q3</i>
                <li>Pré ventes</li><i>1 octobre 2022</i>
            </ul>
            <hr></hr>
            <h2>Q4 2022</h2>
            <h2>MVP</h2>
            <ul>
                <li>Teasing lancement du jeu</li><i>Q4 2022</i>
                <li>Développements ++ (NFT asso/niveaux/marketplace/rareté)</li><i>Q4</i>
                <li>Ventes publiques 🚀 <i>31 décembre 2022</i></li>
            </ul>
            <hr></hr>
            <h2>Q1 2023</h2>
            <h2>KICKOFF</h2>
            <ul>
                <li>Teasing 2 lancement</li><i>1 janvier 2023</i>
                <li>Tests/développements</li><i>Q1 2023</i>
                <li>Lancement du jeu</li><i>21 mars 2023</i>
            </ul>
      </PageSubtitle>
    </div>
  )
}

export default Roadmap
