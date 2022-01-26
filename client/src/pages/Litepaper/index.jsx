import React from 'react';
import Pdf from '../../assets/doc/LitePaper.pdf';

function openPDF(){
  window.open(Pdf);
  return false;
}

function Litepaper() {
  return (
    openPDF()
  )
}

export default Litepaper
