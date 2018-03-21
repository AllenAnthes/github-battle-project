import React from 'react';
import queryString from 'query-string'
import PropTypes from 'prop-types'
import Link from "react-router-dom/es/Link";

import api from '../utils/api'
import PlayerPreview from './PlayerPreview'
import Loading from './Loading'

const Profile = (props) => {
    const info = props.info;
    return (
        <PlayerPreview avatar={info.avatar_url} username={info.login}>
            <ul className={'space-list-items'}>
                {info.name && <li>{info.name}</li>}
                {info.location && <li>{info.location}</li>}
                {info.company && <li>{info.company}</li>}
                <li>Followers: {info.followers}</li>
                <li>Following: {info.following}</li>
                <li>Public Repos: {info.public_repos}</li>
                {info.blog && <li><a href={info.blog}>{info.blog}</a></li>}
            </ul>
        </PlayerPreview>
    )
};


const Player = (props) => {
    return (
        <div>
            <h1 className={'header'}>{props.label}</h1>
            <h3 style={{textAlign: 'center'}}>Score: {props.score}</h3>
            <Profile info={props.profile}/>
        </div>
    )
};


Player.propTypes = {
    label: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    profile: PropTypes.object.isRequired
};


class Result extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            winner: null,
            loser: null,
            error: null,
            loading: true
        };

    }

    componentDidMount() {
        const players = queryString.parse(this.props.location.search);
        api.battle([
            players.playerOneName,
            players.playerTwoName
        ]).then(function (results) {
            if (results === null) {
                return this.setState(function () {
                    return {
                        error: "Looks like there was an error.  Check that both users exist on Github",
                        loading: false
                    }
                })
            }

            this.setState(function () {
                return {
                    error: null,
                    winner: results[0],
                    loser: results[1],
                    loading: false
                }
            })
        }.bind(this))
    }

    render() {
        let {winner, loser, error, loading} = this.state;

        if (loading === true) {
            return <Loading/>
        }

        if (error) {
            return (
                <div>
                    <p>{error}</p>
                    <Link to={'/battle'}>Reset</Link>
                </div>
            )
        }
        return (
            <div className={'row'}>
                <Player
                    label={'Winner'}
                    score={winner.score}
                    profile={winner.profile}
                />
                <Player
                    label={'Loser'}
                    score={loser.score}
                    profile={loser.profile}
                />
            </div>
        )
    }
}

module.exports = Result;