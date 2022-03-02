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

const a = 1;

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
      let web3 = new Web3(window.ethereum);
      let web3Provider = web3.currentProvider;
      //can not use import for @truffle/contract in typescript now
      const TruffleContract = require('@truffle/contract');
      let election = TruffleContract(Election);
      election.setProvider(web3Provider);

      let accounts = await web3.eth.getAccounts();
      // console.log(accounts?.[0]);
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
    } else {
      alert(
        'Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!'
      );
    }
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
    await this.state.electionInstance.vote(candidateId, {
      from: this.state.account,
    });
    this.setState({ hasVoted: true });
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
