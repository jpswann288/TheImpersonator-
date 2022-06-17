import React, { Component } from "react";
import { connect } from "react-redux";
import { VolumeUpFilled } from "@carbon/icons-react";
import "./css/header.scss"

class HeaderNew extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="bx--header">
          <div className="header-title adjust-right"><VolumeUpFilled size={30}/> The Impersonator</div>
      </div>
    )
  }
}
// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
});

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderNew);
