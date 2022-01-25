import React from 'react';
import ReactDOM from 'react-dom';

import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { StyledLink } from '../../utils/style/Atoms'
import LightLogo from '../../assets/light-logo.png'
import DarkLogo from '../../assets/dark-logo.png'
import { useTheme } from '../../utils/hooks'

import colors from '../../utils/style/colors'

const NightModeButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${colors.secondary};
  padding-top: 30px;
`

const HomeLogo = styled.img`
  height: 60px;
`

const NavContainer = styled.nav`
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

function Header() {
  const { toggleTheme, theme } = useTheme()

  return (
    <NavContainer>
      <Link to="/">
        <HomeLogo src={theme === 'light' ? LightLogo : DarkLogo } />
      </Link>
      <div>
        <StyledLink $theme={theme} to="/">
          Accueil
        </StyledLink>
        <StyledLink $theme={theme} to="/mint">
          Mint
        </StyledLink>
        <StyledLink $theme={theme} to="/NFT">
          Mon NFT
        </StyledLink>
        <StyledLink $theme={theme} to="/roadmap">
          Roadmap
        </StyledLink>
        <StyledLink $theme={theme} to="/team">
          Team
        </StyledLink>
        <StyledLink $theme={theme} to="/about">
          About
        </StyledLink>
      </div>
      <NightModeButton onClick={() => toggleTheme()}>
        Changer de mode : {theme === 'light' ? '☀️' : '🌙'}
      </NightModeButton>
    </NavContainer>
  )
}

export default Header
