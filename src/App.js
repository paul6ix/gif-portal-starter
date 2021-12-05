import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import {useEffect, useState} from "react";


// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const App = () => {
//Test data
        const TEST_GIFS = [
            'https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp',
            'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
            'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
            'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp'
        ]
        //Checking if a Solana wallet is connected

//states 
        const [walletAddress, setWalletAddress] = useState(null);
        const [inputValue, setInputValue] = useState('');
        const [gifList, setGifList] = useState([]);


        const CheckingWallet = async () => {
            try {
                const {solana} = window;
                if (solana) {
                    if (solana.isPhantom) {
                        console.log("Phantom wallet is installed");
                        //Checking if solana is connected to a signed wallet

                        const response = await solana.connect({onlyIfTrusted: true});
                        console.log("Connected to public key:",
                            response.publicKey.toString()
                        );
                        setWalletAddress(response.publicKey.toString());
                    } else {
                        alert("Solana wallet not. Please install Phantom wallet");
                    }


                }
            } catch (e) {
                console.error(e);

            }

        }
        //Connect wallet to solana
        const connectWallet = async () => {
            const {solana} = window;
            if (solana) {
                const response = await solana.connect();
                console.log("Connected to a public key", response.publicKey.toString())
                setWalletAddress(response.publicKey.toString())
            }

        };
        //Text input for sending a link
        const onInputChange = (event) => {
            const {value} = event.target;
            setInputValue(value);
        };
        const sendGif = async () => {
            if (inputValue.length > 0) {
                console.log('Gif link:', inputValue);
                setGifList([gifList, inputValue]);
                setInputValue('')
            } else {
                console.log('Empty input. Try again.');
            }
        };

        /*
         * We want to render this UI when the user hasn't connected
         * their wallet to our app yet.
         */
        const renderNotConnectedContainer = () => (
            <button
                className="cta-button connect-wallet-button"
                onClick={connectWallet}
            >
                Connect to Wallet
            </button>
        );
        //Rendering our GIF grid here

        const renderConnectedContainer = () => (
            <div className="connected-container">
                <form onSubmit={(event) => {
                    event.preventDefault()
                    sendGif()
                }}>
                    <input
                        type="text"
                        placeholder="Enter gif link!"
                        value={inputValue}
                        onChange={onInputChange}
                    />
                    <button type="submit" className="cta-button submit-gif-button"> Submit</button>
                </form>
                <div className="gif-grid">
                    {gifList.map((gif) => (
                        <div className="gif-item" key={gif}>
                            <img src={gif} alt={gif}/>
                        </div>
                    ))}

                </div>
            </div>
        )
        // Checking on page load
        useEffect(() => {
            const onLoad = async () => {
                await CheckingWallet();

            };
            window.addEventListener('load', onLoad);
            return () => window.removeEventListener('load', onLoad);

        }, []);

        useEffect(() => {
            if (walletAddress) {
                console.log('Fetching Gif list')
                setGifList(TEST_GIFS)
            }
        }, [walletAddress])

        return (
            <div className="App">
                <div className={walletAddress ? 'authed-container' : 'container'}>
                    <div className="container">
                        <div className="header-container">
                            <p className="header">NFT Display</p>
                            <p className="sub-text">
                                View your GIF collection in the metaverse ✨

                            </p>
                            {!walletAddress && renderNotConnectedContainer()}
                            {walletAddress && renderConnectedContainer()}
                        </div>
                        <div className="footer-container">
                            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo}/>
                            <a
                                className="footer-text"
                                href={TWITTER_LINK}
                                target="_blank"
                                rel="noreferrer"
                            >{`built on @${TWITTER_HANDLE}`}</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
;

export default App;
