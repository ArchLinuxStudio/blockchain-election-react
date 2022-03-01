import React, { Component } from 'react';
import { Candidate } from '@/App';

interface IProps {
  candidates: Candidate[];
  castVote: (candidateId: number) => void;
}

interface IState {
  candidateId: number;
}

class From extends Component<IProps, IState> {
  state = {
    candidateId: 1,
  };

  componentDidMount = () => {
    this.setState({
      candidateId: this.props.candidates?.[0].id,
    });
  };

  selectValueOnchange = async (e: any) => {
    this.setState({ candidateId: e.target.value });
  };

  render() {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          this.props.castVote(this.state.candidateId);
        }}
      >
        <div className="form-group">
          <label>Select Candidate</label>
          <select onChange={this.selectValueOnchange} className="form-control">
            {this.props.candidates.map((candidate: Candidate) => {
              return (
                <option value={candidate.id} key={candidate.id}>
                  {candidate.name}
                </option>
              );
            })}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Vote
        </button>
        <hr />
      </form>
    );
  }
}

export default From;
