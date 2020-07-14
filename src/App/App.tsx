import Tfw from 'tfw'
import React from "react"
import Words from '../words'
import Score from '../score'
import { QRCode } from "react-qr-svg"
import { IPoint } from 'tfw/dist/types'

import "./App.css"

const Button = Tfw.View.Button
const Touchable = Tfw.View.Touchable
const Stack = Tfw.Layout.Stack

Tfw.Theme.apply("default")


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

    private lastTapIndex = 0
    private lastTapTime = 0

    componentDidMount() {
        this.setState({
            words: Words.getWords(this.state.indexes),
            page: this.state.isSolution ? "plateau" : "menu"
        })
    }

    private swap = (index: number, evt: IPoint) => {
        const classes = this.state.classes.slice()
        let value = classes[index]
        const { target } = evt
        if (!target) return

        if (this.lastTapIndex === index && Date.now() - this.lastTapTime < 400) {
            // This is a double tap.
            this.handleConfirmNewGame()
            return
        }
        this.lastTapIndex = index
        this.lastTapTime = Date.now()

        const rect = target.getBoundingClientRect()
        const left = rect.width / 3
        const right = 2 * left
        if (evt.x < left && value !== 1) {
            value = 1
        } else if (evt.x > right && value !== 2) {
            value = 2
        } else {
            value = (value + 3) % 4
        }
        console.info("NEW value=", value)
        classes[index] = value
        this.setState({ classes })
    }

    private handleConfirmNewGame = async () => {
        const confirm = await Tfw.Factory.Dialog.confirm(
            "Manche suivante",
            "Voulez-vous passer à la manche suivante ?"
        )
        if (confirm) {
            window.location.reload()
        }
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
                    <div className="vertical">
                        <p>
                            Pour commencer une manche,<br/>
                            flashez le QRCode avec un smartphone<br/>
                            puis cliquez sur le bouton ci-dessous.
                        </p>
                        <Button
                            wide={true}
                            icon="play"
                            onClick={() => this.setState({ page: "plateau" })}
                            label="Lancer le Jeu" />
                        <Score />
                        <Button
                            wide={true}
                            flat={true}
                            icon="help"
                            onClick={() => this.setState({ page: "help" })}
                            label="Explications" />
                    </div>
                    <Touchable
                        className="qrcode"
                        onClick={() => window.open(url, "code-name")}
                    >
                        <QRCode
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                            level="Q"
                            style={{ width: "calc(80vmin - 2rem)" }}
                            value={url} />
                    </Touchable>
                </div>
                <div
                    key="plateau"
                    className="plateau"
                >
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
                                    onClick={(evt: IPoint) => this.swap(index, evt)}
                                >
                                    <div>{word}</div>
                                </Touchable>
                        ))
                    }
                </div>
                <div key="help" className="help">
                    <h1>Code-Name</h1>
                    <p>
                        Ce jeu fait s'affronter deux équipes.
                        Dans chaque équipe, une partie des jouers doit désigner
                        des mots parmis les 25 proposés, et l'autre partie
                        doit les faire deviner.
                    </p>
                    <h2>Exemple</h2>
                    <p>
                        Supposons que le plateau publique montre ceci (on a réduit à 9 mots
                        pour simplifier, mais le plateau en comporte 25) :
                    </p>
                    <div className="tbl">
                        <div>
                            <div>Abricot</div>
                            <div>Père noël</div>
                            <div>Egypte</div>
                        </div>
                        <div>
                            <div>Espace</div>
                            <div>Chien</div>
                            <div>Manche</div>
                        </div>
                        <div>
                            <div>Sable</div>
                            <div>Bourgeoise</div>
                            <div>Crocodile</div>
                        </div>
                    </div>
                    <p>
                        L'équipe orange constituée de Ludovic et Christelle commence.
                        C'est Ludovic qui fait deviner.<br />
                        Il dit "<em>Chat en 2 cartes</em>" parce qu'il voudrait faire deviner
                        les mots <b>Egypte</b> et <b>Chien</b>. Il ne peut dire qu'un seul mot,
                        mais peut faire deviner autant de cartes qu'il le souhaite.
                    </p>
                    <p>
                        Sur son smartphone, Ludovic a plus d'informations que Christelle.<br />
                        <em>Pour accéder à cet écran,
                        il suffit de flasher le QRCode en début de partie.</em><br />
                        Il voit quels mots appartiennent à quelle équipe et aussi
                        quel est le mot tabou qui fait perdre la manche a l'équipe qui le désigne.
                    </p>
                    <div className="tbl">
                        <div>
                            <div className="blue">Abricot</div>
                            <div className="blue">Père noël</div>
                            <div className="orange">Egypte</div>
                        </div>
                        <div>
                            <div>Espace</div>
                            <div className="orange">Chien</div>
                            <div className="death">Manche</div>
                        </div>
                        <div>
                            <div className="blue">Sable</div>
                            <div>Bourgeoise</div>
                            <div className="orange">Crocodile</div>
                        </div>
                    </div>
                    <p>
                        Christelle désigne <b>Egypte</b> comme première carte parce que
                        c'est le pays des chats. Ce mot appartient bien à l'équipe Orange
                        alors on clique dessus dans le plateau principal jusqu'à ce qu'il
                        soit orange. La première équipe qui a trouvé tous ses mots a gagné.
                        </p>
                    <p>
                        Pour son deuxième mot, Christelle choisit <b>Crocodile</b> à cause
                        des crocodiles du nil. Ce n'est pas le mot auquel Ludovic avait
                        pensé, mais par chance c'est aussi un mot orange, alors il est
                        tout de même gagné et peut être marqué en orange.
                    </p>
                    <p>
                        Si Christelle avait choisi <b>Manche</b> l'équipe orange
                        aurait perdu la manche, même si elle avait plus de mot devinés
                        à son actif.
                    </p>
                    <p>
                        Si Christelle avait choisi <b>Espace</b> la main serait passée
                        à l'équipe bleue (Anaëlle/Léo/Lise).
                    </p>
                    <p>
                        Christelle aurait aussi perdu la main en choisissant <b>Sable</b>.
                        Mais en plus la carte aurait été gagnée par l'équipe des bleus.
                    </p>
                    <h2>Interactions avec le plateau</h2>
                    <p>
                        La version privée pour ceux qui font deviner est statique
                        et rien ne peut y être changé.
                    </p>
                    <p>
                        Pour le plateau que tout le monde voit, on peut cliquer
                        sur les mots pour leur affecter une couleur d'équipe,
                        ou les mettre sur fond noir pour les mots neutres.<br />
                        Chaque équipe a <b>8</b> mots à deviner, un mot est tabou,
                        les autres sont neutres.
                    </p>
                    <p>
                        Cliquez sur le centre d'un mot pour le marquer comme neutre.
                        A droite pour un mot orange et à gauche pour un bleu.
                    </p>
                    <p>
                        Pour changer de manche, il faut double cliquer sur le
                        plateau.
                    </p>
                    <hr/>
                    <div>
                        <Button
                            label="Retour au jeu"
                            icon="back"
                            onClick={() => this.setState({ page: "menu" })} />
                    </div>
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
