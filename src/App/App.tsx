import Tfw from 'tfw'
import React from "react"
import Words from '../words'
import { QRCode } from "react-qr-svg"

import "./App.css"

const Touchable = Tfw.View.Touchable
const Stack = Tfw.Layout.Stack

interface IAppProps {
    className?: string
}
interface IAppState {
    page: string
    isSolution: boolean
    indexes: number[]
    words: string[]
    classes: number[]
    items: string[]
}

export default class App extends React.Component<IAppProps, IAppState> {
    state: IAppState = {
        page: "menu",
        isSolution: Words.getWordIndexesFromURL().length === 25,
        indexes: Words.getRandomWordIndexes(),
        words: [],
        classes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        items: createItems()
    }

    componentDidMount() {
        this.setState({
            words: Words.getWords(this.state.indexes),
            page: this.state.isSolution ? "plateau" : "menu"
        })
    }

    private swap = (index: number) => {
        const classes = this.state.classes.slice()
        classes[index] = (classes[index] + 1) % 4
        this.setState({ classes })
    }

    render() {
        const classes = ['App']
        if (this.props.className) classes.push(this.props.className)

        const url = `${window.location.origin}${window.location.pathname}?${
            this.state.indexes.map(v => v.toString(16)).join(",")
            }`

        return (
            <Stack
                className={classes.join(' ')}
                value={this.state.page}
            >
                <div className="menu" key="menu">
                    <Touchable onClick={() => this.setState({ page: "plateau" })}>
                        <div>Plateau de Jeu</div>
                    </Touchable>
                    <Touchable onClick={() => window.open(url, "code-name")}>
                        <QRCode
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                            level="Q"
                            style={{ width: "calc(80vmin - 2rem)" }}
                            value={url} />
                    </Touchable>
                </div>
                <div key="plateau" className="plateau">
                    {
                        this.state.words.map((word: string, index: number) => (
                            this.state.isSolution ?
                            <div
                                key={`${word}-${index}`}
                                className={this.state.items[index]}
                            >{word}</div> :
                            <Touchable
                                key={`${word}-${index}`}
                                className={`c${this.state.classes[index]}`}
                                onClick={() => this.swap(index)}
                            >
                                <div>{word}</div>
                            </Touchable>
                        ))
                    }
                </div>
            </Stack>
        )
    }
}


function createItems(): string[] {
    const items = ["X", "c3", "c3", "c3", "c3", "c3", "c3", "c3", "c3"]
    for (let i = 0; i < 8; i++) {
        items.push("c1", "c2")
    }

    const len = items.length
    for (let i = 0; i < len; i++) {
        const k = Math.floor(Math.random() * len)
        const tmp = items[i]
        items[i] = items[k]
        items[k] = tmp
    }
    return items
}
