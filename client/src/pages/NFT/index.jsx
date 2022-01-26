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

function NFT() {
  const { theme } = useTheme()

  return (
    <div>
      <PageTitle theme={theme}>Mon NFT</PageTitle>
      <PageSubtitle theme={theme}>
        ICI LNFT
      </PageSubtitle>
    </div>
  )
}

export default NFT
