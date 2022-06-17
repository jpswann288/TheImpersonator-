import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  getRepoLanguage,
  getRepoStars,
  searchRepos,
  RETURN_STATUS,
} from "../globalActions/GlobalActions";
import {
  Search,
  FormLabel,
  Button,
  Accordion,
  AccordionItem,
  Loading,
  ComboBox,
  DataTable,
  DataTableSkeleton,
  Modal,
  TextInput,
  TextArea
} from "carbon-components-react";
import { Add, Download, TrashCan, Query, LogoGithub } from "@carbon/icons-react";
import { CSVLink } from "react-csv";
import StaticData from "../../credentials/staticData.json"

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  TableBatchAction,
  TableBatchActions,
  TableToolbar,
  TableSelectRow,
  TableSelectAll,
} = DataTable;

class TheChallange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      usersData: {},
      name: "",
      desc: "",
      language: "",
      stargazersCount: "",
      gitOwner: "",
      searchStatus:
        "Please search by 'Owner' or leave blank to search all results.",
      selectedRepo: {},
      startIndex: 0,
      endIndex: 10,
      selectedRepos: [],
      deleteModal: false,
      statusMessage: "Click '+ Add Repository(s)' to append data",
      url: ''
    };
  }

  async componentDidUpdate(prevProps) {
    if (this.props.usersData !== prevProps.usersData) {
      this.setState({ usersData: this.props.usersData });
    }
    if (this.props.language !== prevProps.language) {
      let language = "";
      if (Object.keys(this.props.language).length) {
        language = Object.keys(this.props.language)[0];
      }
      this.setState({ language: language });
    }
    if (this.props.stars !== prevProps.stars) {
      this.setState({ stars: this.props.stars.length });
    }
    if (this.props.usersRepos !== prevProps.usersRepos) {
      if (this.props.usersRepos.length) {
        this.props.dispatch(RETURN_STATUS({ status: true }));
        let repos = [];
        for (let obj of this.props.usersRepos) {
          let language = await this.getLanguage(obj.languages_url);
          let stargazersCount = await this.getStars(obj.stargazers_url);
          repos.push({
            id: obj.id,
            label: obj.full_name,
            value: obj.full_name,
            text: obj.full_name,
            stargazersCount: stargazersCount,
            language: language ? language : "",
            url: obj.url,
            description: obj.description,
          });
        }
        this.props.dispatch(RETURN_STATUS({ status: false }));
        this.setState({ repos: repos });
      } else {
        this.setState({
          searchStatus:
            "No repository(s) were found. Please refine your search above.",
        });
      }
    }
    if (this.props.repoStatus !== prevProps.repoStatus) {
      if (this.props.repoStatus.message) {
        this.setState({
          searchStatus:
            "No repository(s) were found. Please refine your search above.",
        });
      }
    }
  }

  async getStars(url) {
    let stars = await this.props.dispatch(getRepoStars(url));
    stars.length ? (stars = stars.length) : (stars = 0);
    return stars;
  }

  async getLanguage(url) {
    let language = await this.props.dispatch(getRepoLanguage(url));
    return language.join(",");
  }

  addRepositorys() {
      if(!this.state.selectedRepos.some(obj => obj.id === this.state.selectedRepo.id)) {
          this.state.selectedRepos.push(this.state.selectedRepo)
          this.setState({selectedRepos: this.state.selectedRepos})
      }
  }

  deleteRepositorys(selectedRows) {
    for(let i=selectedRows.length-1; i>=0; i--) {
        this.state.selectedRepos.forEach((obj, j) => {
            if(obj.id === selectedRows[i].id) {
                this.state.selectedRepos.splice(j,1)
            }
        }) 
    }
    this.setState({selectedRepos: this.state.selectedRepos})
    this.setState({deleteModal: false})
    return true;
  }

  handleRepoChange(event) {
    if (event.selectedItem) {
      this.setState({
        name: event.selectedItem.text,
        desc: event.selectedItem.description,
        language: event.selectedItem.language,
        stargazersCount: event.selectedItem.stargazersCount,
        selectedRepo: event.selectedItem,
        url: event.selectedItem.url
      });
    } else {
      this.setState({
        name: "",
        desc: "",
        language: "",
        stargazersCount: "",
        selectedRepo: {},
      });
    }
  }

  handleOwnerSearchChange(event) {
    this.setState({ gitOwner: event.target.value });
  }

  handleSearch() {
    this.props.dispatch(searchRepos(this.state.gitOwner));
  }

  handleFilterChange(event) {
    let sortedData = this.state.repos;
    if (event.selectedItem.id === 0) {
      sortedData = this.state.repos.sort((a, b) =>
        a.label > b.label ? 1 : -1
      );
    } else if (event.selectedItem.id === 1) {
      sortedData = this.state.repos.sort((a, b) =>
        a.label > b.label ? -1 : 1
      );
    } else if (event.selectedItem.id === 2) {
      sortedData = this.state.repos.sort(
        (a, b) => a.stargazersCount - b.stargazersCount
      );
    } else {
      sortedData = this.state.repos.sort(
        (a, b) => b.stargazersCount - a.stargazersCount
      );
    }
    this.setState({ repos: sortedData });
  }

  download(data, fileName) {
    let headers = [
      { key: "label", label: "Full Name" },
      { key: "description", label: "Description" },
      { key: "language", label: "Language(s)" },
      { key: "stargazersCount", label: "Stargazer Count" },
      { key: "url", label: "Url" },
    ];
    return (
      <CSVLink data={data} headers={headers} filename={fileName}>
        <Button
          disabled={this.props.action === "view"}
          className="button-margin button-with-icon"
        >
          <Download size={20} name="icon--download" />&emsp;Export
        </Button>
      </CSVLink>
    );
  }

  buildTable() {
    let table = <DataTableSkeleton></DataTableSkeleton>;
    let exportButton = <React.Fragment />;

    exportButton = this.download(this.state.selectedRepos, "User_Repos");

    table = (
      <div id="manage-user-table">
        {this.state.deleteModal && (
          <Modal
            id="delete-repo-modal"
            open={this.state.deleteModal}
            passiveModal={false}
            primaryButtonText="Yes"
            secondaryButtonText="No"
            modalHeading="Confirmation"
            onRequestSubmit={(event) =>
              this.deleteRepositorys(this.state.selectedRows)
            }
            onRequestClose={() => this.setState({ deleteModal: false })}
          >
              Are you sure you would like to delete the selected repo(s)?
          </Modal>
        )}
        <DataTable
          rows={this.state.selectedRepos.slice(
            this.state.startIndex,
            this.state.endIndex
          )}
          headers={[
            { key: "label", header: "Full Name" },
            { key: "description", header: "Description" },
            { key: "language", header: "Language(s)" },
            { key: "stargazersCount", header: "Stargazer Count" },
            { key: "url", header: "Url" },
          ]}
          isSortable
          render={({
            rows,
            headers,
            getSelectionProps,
            getBatchActionProps,
            getTableProps,
            getHeaderProps,
            selectedRows,
          }) => (
            <TableContainer title={this.state.statusMessage}>
              <TableToolbar>
                <TableBatchActions {...getBatchActionProps()}>
                  <TableBatchAction
                    tabIndex={
                      getBatchActionProps().shouldShowBatchActions ? 0 : -1
                    }
                    renderIcon={TrashCan}
                    onClick={(event) =>
                      this.setState({
                        selectedRows: selectedRows,
                        deleteModal: true,
                      })
                    }
                  >
                    Delete
                  </TableBatchAction>
                </TableBatchActions>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    <React.Fragment>
                      <TableSelectAll
                        {...getSelectionProps()}
                        className="bx--stick-header-checkbox"
                      />
                    </React.Fragment>
                    {headers.map((header) => (
                      <TableHeader
                        {...getHeaderProps({ header })}
                        className={header.key + "_HEADER"}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} id={row.id + ":repo-header"}>
                      <React.Fragment>
                        <TableSelectRow {...getSelectionProps({ row })} />
                      </React.Fragment>
                      {row.cells.map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cell.id.split(":")[1] + "_HEADER"}
                        >
                          {cell.value}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <br />
              {exportButton}
            </TableContainer>
          )}
        />
      </div>
    );
    return table;
  }

  buildResults() {
    let results = (
      <React.Fragment>
        <Accordion id="EMPTY_RESULTS">
          <AccordionItem
            title={this.state.searchStatus}
            open={true}
          ></AccordionItem>
        </Accordion>
      </React.Fragment>
    );
    if (this.state.repos.length) {
      results = (
        <React.Fragment>
          <Accordion id="RESULTS">
            <AccordionItem title="Please Select a Public Repository Below" open={true}>
              <div className="bx--row">
                <div className="bx--col-lg-4">
                  <FormLabel>Public Repository*</FormLabel>
                  <ComboBox
                    id="repo-combobox"
                    items={this.state.repos}
                    itemToString={(item) => (item ? item.text : "")}
                    placeholder="Filter..."
                    onChange={(event) => this.handleRepoChange(event)}
                    size="lg"
                  />
                </div>
                <div className="bx--col-lg-4">
                  <FormLabel>Filters</FormLabel>
                  <ComboBox
                    id="filters-combobox"
                    items={StaticData.filters}
                    itemToString={(item) => (item ? item.text : "")}
                    placeholder="Filter..."
                    onChange={(event) => this.handleFilterChange(event)}
                    size="lg"
                  />
                </div>
                <div className="bx--col-lg-4 adjust-button">
                  <Button
                    onClick={(event) => this.addRepositorys()}
                    disabled={Object.keys(this.state.selectedRepo).length <= 0}
                  >
                    <Add size={20} />&emsp;Add Repository(s)
                  </Button>
                </div>
              </div>
              <br />
              <br />
              <div className="bx--row">
                <div className="bx--col-lg-4" id="show-disabled-text">
                  <TextInput id="REPO_NAME" labelText="Full Name" value={this.state.name} disabled />
                </div>
                <div className="bx--col-lg-4" id="show-disabled-text">
                  <TextInput
                    id="REPO_LANGUAGE"
                    labelText="Language"
                    value={this.state.language}
                    disabled
                  />
                </div>
                <div className="bx--col-lg-4" id="show-disabled-text">
                  <TextInput
                    id="REPO_COUNT"
                    labelText="Stargazer Count"
                    value={this.state.stargazersCount}
                    disabled
                  />
                </div>
              </div>
              <br />
              <br />
              <div className="bx--row">
                <div className="bx--col-lg-8" id="show-disabled-text">
                  <TextArea
                    id="REPO_DESC"
                    value={this.state.desc ? this.state.desc : ' '}
                    labelText="Description"
                    disabled
                  />
                </div>
                <div className="bx--col-lg-4" id="show-disabled-text">
                  <TextInput
                    id="REPO_URL"
                    labelText="Url"
                    value={this.state.url}
                    disabled
                  />
                </div>
              </div>
              <br />
              <br />
              {this.buildTable()}
            </AccordionItem>
          </Accordion>
        </React.Fragment>
      );
    }
    return results;
  }

  buildSearchFilters() {
    return (
      <React.Fragment>
        <br />
        <div className="bx--row">
          <div className="bx--col-lg-12">
            <h1>The Challenge</h1>
          </div>
        </div>
        <br />
        <br />
        <div className="bx--row">
          <div className="bx--col-lg-4">
            <FormLabel>Search GitHub Repository(s) by Owner</FormLabel>
            <Search
              id="searchGit"
              labelText="Owner"
              value={this.state.gitOwner}
              onChange={(event) => this.handleOwnerSearchChange(event)}
              size="lg"
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  this.handleSearch(e);
                }
              }}
            />
          </div>
          <div className="bx--col-lg-2 adjust-button">
            <Button
              onClick={(event) => this.handleSearch()}
            >
              <Query size={20}/>&emsp;Search Repository(s)
            </Button>
          </div>
          <div className="bx--col-lg-4 adjust-button">
          <Link to={"/TheChallange/CreateRepository"}>
            <Button>
              <LogoGithub size={20} />&emsp;Create Repository
            </Button>
            </Link>
          </div>
        </div>
        <br />
        <br />
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="content-adjust">
        <div className="bx--grid">
          <Loading
            withOverlay={true}
            active={this.props.repoStatus.status}
            className="loading"
          />
          {this.buildSearchFilters()}
          {this.buildResults()}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
});

const mapStateToProps = (state) => ({
  usersData: state.GlobalReducer.usersData,
  usersRepos: state.GlobalReducer.usersRepos,
  language: state.GlobalReducer.language,
  stars: state.GlobalReducer.stars,
  repoStatus: state.GlobalReducer.repoStatus,
});

export default connect(mapStateToProps, mapDispatchToProps)(TheChallange);
