import React from "react"

import "./App.css"

interface IAppProps {
    className?: string
}
interface IAppState {}

export default class App extends React.Component<IAppProps, IAppState> {
    state = {}

    render() {
        const classes = ['App']
        if (this.props.className) classes.push(this.props.className)

        return (<div className={classes.join(' ')}>
        </div>)
    }
}
