import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'
import React from 'react'

import Home from './Home'
import Popular from './Popular'
import Battle from './Battle'
import Results from './Results'
import Nav from './Nav'


class App extends React.Component {
    render() {
        return (
            <Router>
                <div className={'container'}>
                    <Nav/>
                    <Switch>
                        <Route exact path={'/'} component={Home}/>
                        <Route exact path={'/battle'} component={Battle}/>
                        <Route path={'/battle/results'} component={Results}/>
                        <Route path={'/popular'} component={Popular}/>
                        <Route render={() => (<p>Not Found </p>)}/>
                    </Switch>
                </div>
            </Router>
        )
    }
}

module.exports = App;