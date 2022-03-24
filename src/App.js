import React, { Component } from "react";
import GameBoard from "./components/GameBoard";
import NewGame from "./components/NewGame";
import PlayAgain from "./components/PlayAgain";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import axios from "axios";

// API Gateway URL
const API_URL = "https://b0n1v476ud.execute-api.eu-west-1.amazonaws.com/prod";

class App extends Component {
  static initState = () => {
    return {
      newGame: false,
      won: false,
      cards: [],
      clicks: 0,
      previousScore: null,
      bestScore: null,
    };
  };

  state = App.initState();

  putData = async (data) => {
    const auth = await Auth.currentSession();
    let accessToken = auth.getIdToken().getJwtToken();
    // https://axios-http.com/docs/post_example
    const res = await axios.post("/postItems", data, {
      baseURL: API_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res;
  };

  loadUserData = async () => {
    try {
      const auth = await Auth.currentSession();
      let accessToken = auth.getIdToken().getJwtToken();
      // https://axios-http.com/docs/get_example
      const { data } = await axios.get("/getItems", {
        baseURL: API_URL,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (data) {
        console.log(data);
        this.setState({
          previousScore: data.previousScore,
          bestScore: data.bestScore,
        });
      } else {
        throw new Error("data unexpected format");
      }
    } catch (e) {
      console.log("failed to load data", e);
    }
  };

  componentDidMount() {
    this.loadUserData();
  }

  countClicks = () => {
    this.setState((prevState) => ({
      clicks: prevState.clicks + 1,
    }));
  };

  generateDeck = () => {
    // NUMBER OF CARDS
    // CHNAGE TO 10 once set
    let amount = 2;
    let cards = [];
    for (let i = 1; i < amount + 1; i++) {
      let id = createId();
      let id2 = createId();
      let rand = Math.floor(Math.random() * 300) + 1;
      const card1 = {
        id: id,
        matchesId: id2,
        url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${rand}.png`,
        flipped: false,
        found: false,
      };
      const card2 = {
        id: id2,
        matchesId: id,
        url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${rand}.png`,
        flipped: false,
        found: false,
      };
      cards.push(card1);
      cards.push(card2);
    }
    this.shuffleCards(cards);
    this.setState({
      cards: cards,
    });
  };

  shuffleCards = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  resetGame = () => {
    this.setState(
      ({ previousScore, bestScore }) => ({
        ...App.initState(),
        previousScore,
        bestScore,
      }),
      () => {
        this.initGame();
      }
    );
  };

  hasWon = () => {
    const newBest =
      this.state.clicks < this.state.bestScore || this.state.bestScore === null
        ? this.state.clicks
        : this.state.bestScore;

    this.putData({ previousScore: this.state.clicks, bestScore: newBest });
    this.setState({
      won: true,
      previousScore: this.state.clicks,
      bestScore: newBest,
    });
  };

  initGame = () => {
    this.generateDeck();
    this.setState({
      newGame: true,
    });
  };

  render() {
    const { cards, newGame, won, clicks } = this.state;

    return (
      <div>
        {/* <AmplifySignOut /> */}
        <div
          style={{
            color: "white",
            textAlign: "center",
            fontSize: "1.4em",
            paddingTop: "1em",
          }}
        >
          <b>BestScore:</b> {this.state.bestScore || "none set"} &nbsp;
          <b>PreviouScore:</b> {this.state.previousScore || "none set"}
        </div>
        <div className="board-container">
          {newGame ? (
            <GameBoard
              cards={cards}
              won={this.hasWon}
              click={this.countClicks}
            />
          ) : null}
          {newGame && <p className="message center">Total flips: {clicks}</p>}
        </div>

        <div className="menu">
          <div className="message">{won && <h2>You win!</h2>}</div>
          <NewGame play={this.initGame} />
          {won && <PlayAgain again={this.resetGame} />}
        </div>
      </div>
    );
  }
}

//export default withAuthenticator(App);
export default App;

const createId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
