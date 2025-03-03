"use client";
import { useState, useEffect } from 'react';

function Blackjack() {
    const [gameState, setGameState] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Define a standard deck of 52 cards.
    const suits = ["spades", "hearts", "clubs", "diamonds"];
    const ranks = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
    const deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push(`${rank}_${suit}`);
        }
    }

    // Helper to construct the URL for card images.
    const getCardImageUrl = (card) => `/projects/data/Blackjack/resources/cards/${card}.png`;

    // Fetch the current game state from the backend.
    const fetchGameState = async () => {
        try {
            const res = await fetch('/api/blackjack/state');
            if (!res.ok) throw new Error('Failed to fetch game state');
            const data = await res.json();
            setGameState(data);
            setError(''); // Clear any previous error.
        } catch (err) {
            // Instead of showing an error message, we let "error" be truthy and show the full deck.
            setError(err.message);
        }
    };

    // Fetch state on mount.
    useEffect(() => {
        fetchGameState();
    }, []);

    // Basic game actions.
    const hit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/blackjack/hit', { method: 'POST' });
            if (!res.ok) throw new Error('Failed to hit');
            const data = await res.json();
            setGameState(data);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const stand = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/blackjack/stand', { method: 'POST' });
            if (!res.ok) throw new Error('Failed to stand');
            const data = await res.json();
            setGameState(data);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const newRound = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/blackjack/reset', { method: 'POST' });
            if (!res.ok) throw new Error('Failed to start new round');
            const data = await res.json();
            setGameState(data);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Toggle one of the modes: MC, TD, QL, or Auto Play.
    const toggleMode = async (mode) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/blackjack/toggle?mode=${mode}`, { method: 'POST' });
            if (!res.ok) throw new Error(`Failed to toggle ${mode}`);
            const data = await res.json();
            setGameState(data);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[100vw]">
                <h1 className="text-4xl font-bold text-center mb-4 text-slate-800">Blackjack is Under Construction!</h1>
                {/* If there's an error, show the full deck instead of an error message */}
                {error ? (
                    <div>
                        <h2 className="text-xl font-semibold text-center mb-2 text-slate-600">Place Holder Deck</h2>
                        <div className="overflow-x-auto">
                            {/* Mobile view: group cards by suit in vertical columns */}
                            <div className="flex md:hidden justify-center">
                                {suits.map(suit => (
                                    <div key={suit} className="flex flex-col gap-2 mr-4">
                                        {ranks.map(rank => {
                                            const card = `${rank}_${suit}`;
                                            return (
                                                <img
                                                    key={card}
                                                    src={getCardImageUrl(card)}
                                                    alt={card}
                                                    className="w-24"
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                            {/* Medium and large screens: keep horizontal grid layout */}
                            <div
                                className="hidden md:grid gap-2"
                                style={{ gridTemplateColumns: 'repeat(13, 1fr)' }}
                            >
                                {deck.map(card => (
                                    <img
                                        key={card}
                                        src={getCardImageUrl(card)}
                                        alt={card}
                                        className="w-18"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Otherwise, show the game state UI.
                    gameState ? (
                        <div className="flex flex-col md:flex-row">
                            {/* Left panel: Cards display */}
                            <div className="flex-1 p-4">
                                <h2 className="text-2xl font-semibold mb-2">Dealer&apos;s Hand</h2>
                                <div className="flex space-x-2 mb-4">
                                    {gameState.gameOver || gameState.stand ? (
                                        gameState.dealerCards.map((card, index) => (
                                            <img key={index} src={getCardImageUrl(card)} alt={card} className="w-16" />
                                        ))
                                    ) : (
                                        <>
                                            <img
                                                src={getCardImageUrl(gameState.dealerCards[0])}
                                                alt={gameState.dealerCards[0]}
                                                className="w-16"
                                            />
                                            <img src="/resources/cardback.png" alt="card back" className="w-16" />
                                        </>
                                    )}
                                </div>
                                <h2 className="text-2xl font-semibold mb-2">Your Hand</h2>
                                <div className="flex space-x-2 mb-2">
                                    {gameState.playerCards.map((card, index) => (
                                        <img key={index} src={getCardImageUrl(card)} alt={card} className="w-16" />
                                    ))}
                                </div>
                            </div>
                            {/* Right panel: Game info & controls */}
                            <div className="flex-1 p-4 border-l border-gray-300">
                                <div className="mb-4">
                                    <p>
                                        <strong>State:</strong> {gameState.state}
                                    </p>
                                    <p>
                                        <strong>QL:</strong> Values [{gameState.QL?.values[0].toFixed(2)},{' '}
                                        {gameState.QL?.values[1].toFixed(2)}] (Samples: [{gameState.QL?.samples[0]},{' '}
                                        {gameState.QL?.samples[1]}])
                                    </p>
                                </div>
                                <div className="mb-4">
                                    <p>
                                        <strong>Wins:</strong> {gameState.winNum} | <strong>Losses:</strong> {gameState.loseNum}
                                    </p>
                                    <p>
                                        <strong>Games:</strong> {gameState.winNum + gameState.loseNum} |{' '}
                                        <strong>Win Rate:</strong>{' '}
                                        {gameState.winNum + gameState.loseNum > 0
                                            ? ((gameState.winNum / (gameState.winNum + gameState.loseNum)) * 100).toFixed(2)
                                            : 0}
                                        %
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={hit}
                                        disabled={gameState.gameOver || gameState.stand || gameState.toggles.autoPlay}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Hit
                                    </button>
                                    <button
                                        onClick={stand}
                                        disabled={gameState.gameOver || gameState.stand || gameState.toggles.autoPlay}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Stand
                                    </button>

                                    <button
                                        onClick={() => toggleMode('QL')}
                                        className={`font-bold py-2 px-4 rounded ${gameState.toggles.autoQL
                                            ? 'bg-green-500 hover:bg-green-700 text-white'
                                            : 'bg-gray-300 text-black'
                                            }`}
                                    >
                                        QL {gameState.toggles.autoQL ? 'On' : 'Off'}
                                    </button>
                                    <button
                                        onClick={() => toggleMode('autoPlay')}
                                        className={`font-bold py-2 px-4 rounded ${gameState.toggles.autoPlay
                                            ? 'bg-green-500 hover:bg-green-700 text-white'
                                            : 'bg-gray-300 text-black'
                                            }`}
                                    >
                                        Auto Play {gameState.toggles.autoPlay ? 'On' : 'Off'}
                                    </button>
                                    <button
                                        onClick={newRound}
                                        className="col-span-2 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        New Round
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center">Loading game state...</p>
                    )
                )}
                {loading && <p className="text-center mt-4">Loading...</p>}
            </div>
        </div>
    );
}

export default Blackjack;
