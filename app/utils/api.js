import axios from 'axios'

const id = '777696b74b80406f5119';
const sec = 'dc83ec05056b8eddd94a77d24360940104873123';
const params = '?client_id=' + id + '&client_secret=' + sec;

function getProfile(username) {
    return axios.get('http://api.github.com/users/' + username + params)
        .then((user) => {
            return user.data;
        });
}

function getRepos(username) {
    return axios.get('http://api.github.com/users/' + username + '/repos' + params +
        '&per_page=100')
}

function getStarCount(repos) {
    return repos.data.reduce((count, repo) => {
        return count + repo.stargazers_count;
    }, 0);
}

function calculateScore(profile, repos) {
    const followers = profile.followers;
    const totalStars = getStarCount(repos);

    return (followers * 3) + totalStars;
}

function sortPlayers(players) {
    return players.sort(function(a,b) {
        return b.score - a.score;
    });
}

function handleError(error) {
    console.warn(error);
    return null;
}

function getUserData(player) {
    return axios.all([
        getProfile(player),
        getRepos(player)
    ]).then((data) => {
        const profile = data[0];
        const repos = data[1];

        return {
            profile: profile,
            score: calculateScore(profile, repos)
        }
    })
}

module.exports = {

    battle: (players) => {
        return axios.all(players.map(getUserData))
            .then(sortPlayers)
            .catch(handleError)
    },


    fetchPopularRepos: language => {
        let encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=stars:>1+language:' +
            language + '&sort=stars&order=desc&type=Repositories');
        return axios.get(encodedURI).then((response) => (response.data.items))
    }
};