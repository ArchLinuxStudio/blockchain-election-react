import React, { Component } from 'react';
import Table from '@/Table';
import Form from '@/Form';
import { Candidate } from '@/App';

interface IProps {
  account: string;
  hasVoted: boolean;
  candidates: Candidate[];
  castVote: (candidateId: number) => void;
}

interface IState {}

class Content extends Component<IProps, IState> {
  render() {
    return (
      <div style={{}}>
        <Table candidates={this.props.candidates} />
        <hr />
        {!this.props.hasVoted ? (
          <Form
            candidates={this.props.candidates}
            castVote={this.props.castVote}
          />
        ) : null}
        <p>Your account: {this.props.account}</p>
      </div>
    );
  }
}

export default Content;
