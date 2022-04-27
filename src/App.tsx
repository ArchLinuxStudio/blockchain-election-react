import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
// import TruffleContract from '@truffle/contract'
import Election from '@/build/contracts/Election.json';
import Content from '@/Content';

declare let window: any;

export interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}

interface IProps {}

interface IState {
  account: string;
  candidates: Candidate[];
  hasVoted: boolean;
  loading: boolean;
  voting: boolean;
  electionInstance: {};
}

class App extends Component<IProps, IState> {
  state = {
    account: '0x0',
    candidates: [] as Candidate[],
    hasVoted: false,
    loading: true,
    voting: false,
    electionInstance: {} as any,
  };

  fetchCandidatesData = async (electionInstance: any) => {
    let candidatesCount = await electionInstance.candidatesCount();

    let candidates = [];
    for (var i = 1; i <= candidatesCount; i++) {
      let candidate = await electionInstance.candidates(i);
      candidates.push({
        id: candidate[0],
        name: candidate[1],
        voteCount: candidate[2],
      });
    }

    this.setState({
      candidates: candidates,
    });
  };

  componentDidMount = async () => {
    if (window.ethereum) {
      // connect metamask
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // create web3
      let web3 = new Web3(window.ethereum);
      this.initApp(web3);
    } else {
      let web3 = new Web3(
        new Web3.providers.HttpProvider('http://localhost:7545')
      );
      let accounts = await web3.eth.getAccounts();
      console.log(accounts);
      this.initApp(web3);
      alert(
        'Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp! Try to use localhost ganache now.'
      );
    }
  };

  initApp = async (web3: any) => {
    //can not use import for @truffle/contract in typescript now
    const TruffleContract = require('@truffle/contract');
    let election = TruffleContract(Election);
    election.setProvider(web3.currentProvider);

    let accounts = await web3.eth.getAccounts();
    // console.log(accounts[0]);
    let electionInstance = await election.deployed();

    await this.fetchCandidatesData(electionInstance);

    let hasVoted = await electionInstance.voters(accounts?.[0]);
    this.setState(
      {
        account: accounts?.[0],
        electionInstance,
        hasVoted,
        loading: false,
      },
      () => {
        this.watchEvents();
      }
    );
  };

  watchEvents = async () => {
    // console.log(this.state.electionInstance);
    //https://github.com/trufflesuite/truffle/issues/1254

    // await this.state.electionInstance.getPastEvents(
    //   'votedEvent',
    //   {
    //     filter: {},
    //     fromBlock: 0,
    //     toBlock: 'latest',
    //   },
    //   () => {
    //     this.setState({ voting: false });
    //   }
    // );

    await this.state.electionInstance.votedEvent(
      {
        fromBlock: 0,
      },
      async () => {
        await this.fetchCandidatesData(this.state.electionInstance);
        this.setState({ voting: false });
      }
    );
  };

  castVote = async (candidateId: number) => {
    this.setState({ voting: true });
    console.log('vote now');
    let ret = await this.state.electionInstance.vote(candidateId, {
      from: this.state.account,
    });
    console.log('ret: ' + JSON.stringify(ret));

    this.setState({ hasVoted: true });
    // when use localhost ganache web3, the browser can not react with event.
    // do it manually
    if (!window.ethereum && ret.logs?.[0]?.event === 'votedEvent') {
      await this.fetchCandidatesData(this.state.electionInstance);
      this.setState({ voting: false });
    }
    return 'Vote completed';
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="text-center">
            <h1>Election Results</h1>
            <br />
            {this.state.loading || this.state.voting ? (
              <p className="text-center">Loading...</p>
            ) : (
              <Content
                account={this.state.account}
                candidates={this.state.candidates}
                hasVoted={this.state.hasVoted}
                castVote={this.castVote}
              />
            )}
          </div>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
