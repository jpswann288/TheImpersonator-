import "./css/TI.scss";
import "carbon-components/scss/globals/scss/styles.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import HeaderNew from "./Header";
import FooterNew from "./Footer";
import TheChallange from "./components/thechallange/TheChallange";
import CreateRepositoryForm from "./components/createrepository/CreateRepositoryForm"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
  }

  render() {
    return (
      <Router>
        <React.Fragment>
          <HeaderNew />
          <Switch>
              <Redirect exact from="/" to="/TheChallange" />
              <Route exact path="/TheChallange" component={TheChallange} />
              <Route path="/TheChallange/CreateRepository" component={CreateRepositoryForm} />
          </Switch>
          <FooterNew />
        </React.Fragment>
      </Router>
    );
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
});

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(App);