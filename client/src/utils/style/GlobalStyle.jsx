import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components'
import { useTheme } from '../hooks'
import Background from '../../assets/img/forest-background.jpeg';
import BackgroundNight from '../../assets/img/forest-background-night.jpeg';

const StyledGlobalStyle = createGlobalStyle`
    * {
      font-family: 'Trebuchet MS', Helvetica, sans-serif;
    }

    a {
      text-decoration: none;
    }

    body {
      background: ${(props) =>
        props.isDarkMode ? `url("${BackgroundNight}")` : `url("${Background}")`};
      background-color: ${(props) =>
          props.isDarkMode ? '#2F2E41' : 'white'};
        margin: 0;
        background-size: cover;
        background-repeat: no-repeat;
    }
    #root nav{
      background-color:${(props) =>
        props.isDarkMode ? 'grey' : 'white'};
    }
    #root nav button{
      color:${(props) =>
        props.isDarkMode ? '#ffffff' : '#002230'};
    }
    .roadmap {
      background-color:${(props) =>
        props.isDarkMode ? '#002230' : 'white'};
        color:${(props) =>
          props.isDarkMode ? 'white' : 'black'};
    }
    `

function GlobalStyle() {
  const { theme } = useTheme()

  return <StyledGlobalStyle isDarkMode={theme === 'dark'} />
}

export default GlobalStyle
