import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { WatsonHealthStudyNext, WatsonHealthStudyPrevious, ReportData } from '@carbon/icons-react'

class cardTile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
            name: '',
            login: '',
            followers: '',
            following: '',
            repos: '',
            avatar: ''
		}
	}

	componentDidMount() {
	}

    componentDidUpdate(prevProps) {
        if(this.props.usersData != prevProps.usersData) {
            this.setState({
                name: this.props.usersData.name,
                login: this.props.usersData.login,
                followers: this.props.usersData.followers,
                following: this.props.usersData.following,
                repos: this.props.usersData.public_repos,
                avatar: this.props.usersData.avatar_url
            })
        }
    }

	render() {
        return (
            <div className='card-wrapper'>
                <div>
                    <img src={this.state.avatar}/>
                    <div className='card-login'>
                        {this.state.name}
                    </div>
                    <br/>
                    <div className='card-login'>
                        {this.state.login}
                    </div>
                    <br/>
                    <div className='card-info'>
                        <WatsonHealthStudyPrevious size={16}/> {this.state.followers} Followers
                    </div>
                    <br/>
                    <div className='card-info'>
                        <WatsonHealthStudyNext size={16} /> {this.state.following} Following
                    </div>
                    <br/>
                    <div className='card-info'>
                        <ReportData size={16}/> {this.state.repos} Repos
                    </div>
                </div>
            </div>	
        )
	}
}
// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = dispatch => ({
	dispatch: dispatch,
})

const mapStateToProps = state => ({
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(cardTile))
