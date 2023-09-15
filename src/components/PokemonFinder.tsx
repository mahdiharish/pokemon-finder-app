import React, { useEffect, useState } from "react";
import axios from "axios";

const PokemonFinder: React.FC = () => {
    const [pokemonName, setPokemonName] = useState("");
    const [pokemonData, setPokemonData] = useState<any>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (pokemonData) {
            getPokemonType();
        }
    }, [pokemonData]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPokemonName(event.target.value);
    }

    const handleSearchClick = async () => {
        await searchPokemon();
    }

    const handleSearchEnter = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            await searchPokemon();
        }
    }

    const searchPokemon = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            setPokemonData(response.data);
            setError("");
        } catch (error) {
            setPokemonData(null);
            setError("Pokemon not found!");
        } finally {
            setIsLoading(false);
        }
    };

    const getPokemonType = async () => {
        try {
            const typeUrl = pokemonData.types[0].type.url;
            const typeResponse = await axios.get(typeUrl);
            const typeName = typeResponse.data.name;
            setPokemonData({...pokemonData, typeName});
        } catch (error) {
            setPokemonData(null);
            setError("Pokemon not found!");
        }
    }

    return (
        <>
            <div className="bg-white p-8 rounded shadow-md">
                <h1 className="text-3xl font-bold mb-4">POKEMON FINDER</h1>
                <div className="mb-2">                
                    <input 
                    type="text" 
                    placeholder="Enter Pokemon name here..." 
                    onChange={handleInputChange} 
                    onKeyPress={handleSearchEnter} 
                    value={pokemonName}
                    className="py-3 px-5 block w-full border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                />
                </div>
                <div className="mb-2">
                    <button 
                    onClick={handleSearchClick} 
                    disabled={isLoading}
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
                    {isLoading ? "Searching..." : "Search the Pokemon!"}
                </button>
                </div>

                {error && <div className="bg-red-500 text-sm text-white rounded-md p-4" role="alert">
                    <span className="font-bold">{error}</span>
                    </div>}
                </div>
            <div>
                {pokemonData && (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">{pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
                        <div className="flex justify-center">
                        <img src={pokemonData.sprites.other["official-artwork"].front_default} alt={pokemonData.name} className="max-w-xs" />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default PokemonFinder;