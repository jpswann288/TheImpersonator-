import React from "react";
import { connect } from "react-redux";
import {
  Button,
  Accordion,
  AccordionItem,
  TextInput,
  TextArea,
  RadioButtonGroup,
  RadioButton,
  FormGroup
} from "carbon-components-react";
import { Link } from "react-router-dom";
import { Add, ChevronLeft } from "@carbon/icons-react";
import { createRepository } from "../globalActions/GlobalActions";

class CreateRepositoryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      desc: "",
      owner: "",
    };
  }

  createRepository() {
    console.log("here");
    let params = {
      template_owner: this.state.owner,
      template_repo: this.state.name,
      owner: this.state.owner,
      name: this.state.name,
      description: this.state.desc,
      include_all_branches: false,
      private: false,
    };
    this.props.dispatch(createRepository(params));
  }

  buildForm() {
    return (
      <React.Fragment>
        <br />
        <div className="bx--row">
          <div className="bx--col-lg-8">
            <h1>Create Repoistory</h1>
          </div>
          <div className="bx--col-lg-4 adjust-button offset-right">
            <Link to="/TheChallange">
              <Button>
                <ChevronLeft size={20} />
                &emsp;Back
              </Button>
            </Link>
          </div>
        </div>
        <br />
        <br />
        <Accordion id="RESULTS">
          <AccordionItem title="Create Repoistory" open={true}>
            <div className="bx--row">
              <div className="bx--col-lg-6">
                <TextInput
                  id="REPO_OWNER"
                  labelText="Owner*"
                  value={this.state.owner}
                  onChange={(text) => {
                    this.setState({ owner: text.target.value });
                  }}
                />
              </div>
              <div className="bx--col-lg-6">
                <TextInput
                  id="REPO_NAME"
                  labelText="Repository Name*"
                  value={this.state.name}
                  onChange={(text) => {
                    this.setState({ name: text.target.value });
                  }}
                />
              </div>
            </div>
            <br />
            <br />
            <div className="bx--row">
              <div className="bx--col-lg-4">
                <TextArea
                  id="REPO_DESC"
                  value={this.state.desc ? this.state.desc : " "}
                  labelText="Description"
                  onChange={(text) => {
                    this.setState({ desc: text.target.value });
                  }}
                />
              </div>
              <div className="bx--col-lg-4">
                <FormGroup legendText="Is this repository private or public?">
                  <RadioButtonGroup
                    defaultSelected="default-selected"
                    legend="Group Legend"
                    name="radio-button-group"
                    valueSelected="default-selected"
                  >
                    <RadioButton
                      id="radio-1"
                      labelText="Private"
                      value="standard"
                    />
                    <RadioButton
                      id="radio-2"
                      labelText="Public"
                      value="default-selected"
                    />
                  </RadioButtonGroup>
                </FormGroup>
              </div>
              <div className="bx--col-lg-4 adjust-button offset">
                <Button
                  onClick={(event) => this.createRepository()}
                  disabled={
                    this.state.owner.length && this.state.name.length
                      ? false
                      : true
                  }
                >
                  <Add size={20} />
                  &emsp;Create Repository
                </Button>
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className="content-adjust">
          <div className="bx--grid">{this.buildForm()}</div>
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
});

const mapStateToProps = (state) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateRepositoryForm);
