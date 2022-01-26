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

function Team() {
  const { theme } = useTheme()

  return (
    <div>
      <PageSubtitle theme={theme}>
          <div className="about">
            <div className="whiteBox">
              <h1>Camille RENOUX</h1>
              <ul>
                <li>Gestion de projet</li>
                <li>Finance</li>
                <li>Marketing</li>
                <li>Blockchain</li>
              </ul>
            </div>
            <div className="greenBox">
              <h1>NicolasVILLA</h1>
              <ul>
                <li>Dev PHP/JS WEB/LINUX</li>
                <li>CMS & Frameworks PHP</li>
                <li>Blockchain</li>
              </ul>
            </div>
            <div className="whiteBox">
              <h1>Aram ARAKELYAN</h1>
              <ul>
                <li>Dev Adnroid Java/Kotlin</li>
                <li>Application</li>
                <li>Blockchain</li>
              </ul>
            </div>

            <div className="greenBox">
              <h1>Valentin SIMONY</h1>
              <ul>
                <li>Entreprenariat</li>
                <li>Gestion de projet</li>
                <li>Communication</li>
                <li>Blockchain</li>
              </ul>
            </div>
            <div className="whiteBox">
              <h1>Sylvain Rey</h1>
              <ul>
                <li>Dev Android</li>
                <li>Frameworks</li>
                <li>Blockchain</li>
              </ul>
            </div>
            <div className="greenBox">
              <h1>Anas BELBAZ</h1>
              <ul>
                <li>Ingénieur logiciel</li>
                <li>Application web</li>
                <li>NFT</li>
                <li>Blockchain</li>
              </ul>
            </div>
            
          </div>        
      </PageSubtitle>
    </div>
  )
}

export default Team
