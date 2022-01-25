import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import styled from 'styled-components'
import { Link } from 'react-router-dom'
import colors from '../../utils/style/colors'
import { Loader } from '../../utils/style/Atoms'
import { useFetch, useTheme } from '../../utils/hooks'
import tree from '../../assets/img/tree.png'
import LeafContract from "../../contracts/LeafDapp.json";
import { Button, Col, Container, Card, FormCheck, Row } from "react-bootstrap";
import getWeb3 from "../../getWeb3";

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

function Mint() {
  const { theme } = useTheme()

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const inputWithDrow = useRef();
  const inputGetPlayer = useRef();
  const inputWhiteList = useRef();
  const inputRemoveWhiteList = useRef();
  const inputSetCost = useRef();
  const inputBalance = useRef();

  const [owner, setOwner] = useState("");
  const [balanceEth, setBalanceEth] = useState(0);
  const [supplyLeaf, setSupplyLeaf] = useState(0);
  const [supplyNft, setSupplyNft] = useState(0);
  const [pause, setPause] = useState(false);
  const [test, setTest] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = LeafContract.networks[networkId];
        const instance = new web3.eth.Contract(
          LeafContract.abi,
          deployedNetwork && deployedNetwork.address
          // "0x3e29b9c2a4A633885a19cb249e2dcEf0A5d27A10"
        );

        setContract(instance);

        const owner = await instance.methods
          .owner()
          .call({ from: accounts[0] });
        const isOwn = owner == accounts[0];

        setAccount(accounts[0]);
        setIsOwner(isOwn);

        if (isOwn) {
          const ethBalance = await instance.methods
            .balanceDappEth()
            .call({ from: accounts[0] });
          const leafSupply = await instance.methods
            .balanceDappLeaf()
            .call({ from: accounts[0] });
          const nftSupply = await instance.methods
            .balanceNft()
            .call({ from: accounts[0] });

          const p = await instance.methods
            .getPause()
            .call({ from: accounts[0] });

          const t = await instance.methods
            .getTest()
            .call({ from: accounts[0] });

          setBalanceEth(web3.utils.fromWei(ethBalance, "ether"));
          setSupplyLeaf(leafSupply);
          setSupplyNft(nftSupply);
          setPause(p);
          setTest(t);
        }

        // const nftAddr = await instance.methods.nft().call({from: accounts[0]});
        // console.log("ZZZZZZZZZZZZZZZZZZZZZ   " + nftAddr);
        // const nft1Uri = await instanceNft.methods.tokenURI(1).call({from: accounts[0]});
        // setNftJson(await (await fetch(`https://ipfs.io/ipfs/${nft1Uri.substring(7)}`)).json());
        // console.log("ZZZZZZZZZZZZZZZZZZZZZ   " + nft1Uri);

        // await instance.methods.buyNft().send({from: accounts[0], value: web3.utils.toWei('0.01', 'ether')});
        // // // await instance.methods.stepToLeafWithoutTimestamp(12000).send({from: accounts[0]});
        // const player = await instance.methods.getPlayer().call({from: accounts[0]});
        // console.log(accounts[0]);
        // console.log("player : " + player);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );

        console.error(error);
      }
    })();
  }, [owner]);

  useEffect(() => {
    (async () => {
      window.ethereum.on("accountsChanged", async function () {
        window.location.reload(false);
      });
    })();
  }, []);

  ///////////////////////////////////////////////////////////////////////////////////////
  /// FUNCTIONS
  ///////////////////////////////////////////////////////////////////////////////////////

  const pauseChanged = async () => {
    const change = !pause;
    await contract.methods.setPause(change).send({ from: account });
    setPause(change);
  };

  const testChanged = async () => {
    const change = !test;
    await contract.methods.setTest(change).send({ from: account });
    setTest(change);
  };

  const costChanged = async (e) => {
    e.preventDefault();
    let value = inputSetCost.current.value;
    await contract.methods.setCost(value).send({ from: account });
  };

  return (
    <div>
      <PageTitle theme={theme}>Mint</PageTitle>
      <PageSubtitle theme={theme}>
      {isOwner ? (
          <div>
            <div>
              <h4>OWNER : {isOwner && account}</h4>
            </div>

            <div>
              <hr width="60%" />
              <h2>Balances & Supply</h2>
              <h5>Eth disponible : {balanceEth}</h5>
              <h5>LEAF supply : {supplyLeaf}</h5>
              <h5>LNFT supply : {supplyNft}/10000</h5>
            </div>

            <div>
              <hr width="60%" />
              <h2>Changement du Dapp</h2>
              <FormCheck
                type="switch"
                checked={pause}
                onChange={pauseChanged}
                label="Mettre le Dapp en pause"
              />
              <FormCheck
                type="switch"
                checked={test}
                onChange={testChanged}
                label="Passer en mode test"
              />


              <form onSubmit={costChanged} className="form">
                <label>
                  <input
                    type="text"
                    ref={inputSetCost}
                    className="input"
                  />
                </label>
                <input type="submit" value="Changer le Prix de LNFT" className="button" />
              </form>

            </div>
          </div>
        ) : (
          <h5>Player : {account}</h5>
        )}        
      </PageSubtitle>
    </div>
  )
}

export default Mint
