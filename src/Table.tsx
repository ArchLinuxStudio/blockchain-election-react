import React, { Component } from 'react';
import { Candidate } from '@/App';

interface IProps {
  candidates: Candidate[];
}

interface IState {
  candidateId: number;
}

class Table extends Component<IProps, IState> {
  render() {
    return (
      <table className="table" style={{ color: 'white' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {this.props.candidates.map((candidate) => {
            // console.log(candidate);
            return (
              <tr key={candidate.id.toString()}>
                <th>{candidate.id.toString()}</th>
                <td>{candidate.name}</td>
                <td>{candidate.voteCount.toString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default Table;
