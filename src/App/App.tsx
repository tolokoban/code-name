import Tfw from 'tfw'
import React from "react"
import Words from '../words'

import "./App.css"

const Touchable = Tfw.View.Touchable
const Stack = Tfw.Layout.Stack

interface IAppProps {
    className?: string
}
interface IAppState {
    page: string
    words: string[]
    classes: number[]
    items: string[]
}

export default class App extends React.Component<IAppProps, IAppState> {
    state = {
        page: "menu",
        words: Words.randomWords(),
        classes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        items: createItems()
    }

    private swap = (index: number) => {
        const classes = this.state.classes.slice()
        classes[index] = (classes[index] + 1) % 4
        this.setState({ classes })
    }

    render() {
        const classes = ['App']
        if (this.props.className) classes.push(this.props.className)

        return (
            <Stack
                className={classes.join(' ')}
                value={this.state.page}
            >
                <div className="menu" key="menu">
                    <Touchable onClick={() => this.setState({ page: "plateau" })}>
                        <div>Plateau de Jeu</div>
                    </Touchable>
                    <Touchable onClick={() => this.setState({ page: "carte" })}>
                        <div>Cartes secrètes</div>
                    </Touchable>
                </div>
                <div key="plateau" className="plateau">
                    {
                        this.state.words.map((word: string, index: number) =>
                            <Touchable
                                className={`c${this.state.classes[index]}`}
                                onClick={() => this.swap(index)}
                            >
                                <div key={word}>{word}</div>
                            </Touchable>
                        )
                    }
                </div>
                <div key="carte" className="carte" onDoubleClick={
                    () => this.setState({ items: createItems() })
                }>
                    <div>
                        {
                            this.state.items.map(
                                (itm: string, idx: number) =>
                                    <div key={`${itm}${idx}`} className={itm}>X</div>)
                        }
                    </div>
                </div>
            </Stack>
        )
    }
}


function createItems(): string[] {
    const items = ["X", "O", "O", "O", "O", "O", "O", "O", "O"]
    for (let i = 0; i < 8; i++) {
        items.push("A", "B")
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
