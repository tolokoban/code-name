import React from "react"
import Tfw from 'tfw'



import "./score.css"

const Button = Tfw.View.Button
const _ = Tfw.Intl.make(require("./score.json"))

interface IScoreProps {
    className?: string | string[]
}
interface IScoreState {
    orange: number
    blue: number
}

export default class Score extends React.Component<IScoreProps, IScoreState> {
    state: IScoreState = {
        orange: Tfw.Converter.Integer(Tfw.Storage.session.get("score/orange", 0), 0),
        blue: Tfw.Converter.Integer(Tfw.Storage.session.get("score/blue", 0), 0),
    }

    private handleBlueMinus = () => {
        const value = Math.max(0, this.state.blue - 1)
        this.setState({ blue: value })
        Tfw.Storage.session.set("score/blue", value)
    }

    private handleBluePlus = () => {
        const value = this.state.blue +1
        this.setState({ blue: value })
        Tfw.Storage.session.set("score/blue", value)
    }

    private handleOrangeMinus = () => {
        const value = Math.max(0, this.state.orange - 1)
        this.setState({ orange: value })
        Tfw.Storage.session.set("score/orange", value)
    }

    private handleOrangePlus = () => {
        const value = this.state.orange +1
        this.setState({ orange: value })
        Tfw.Storage.session.set("score/orange", value)
    }

    render() {
        const classes = [
            'Score',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]

        return (<div className={classes.join(' ')}>
            <div>
                <Button
                    icon="minus"
                    small={true}
                    onClick={this.handleBlueMinus}
                />
                <div className="score thm-bgPD">{this.state.blue}</div>
                <Button
                    icon="plus"
                    small={true}
                    onClick={this.handleBluePlus}
                />
            </div>
            <div>
                <Button
                    icon="minus"
                    warning={true}
                    small={true}
                    onClick={this.handleOrangeMinus}
                />
                <div className="score thm-bgSD">{this.state.orange}</div>
                <Button
                    icon="plus"
                    warning={true}
                    small={true}
                    onClick={this.handleOrangePlus}
                />
            </div>
        </div>)
    }
}
