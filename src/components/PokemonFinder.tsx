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
                    className="border rounded py-2 px-3 w-64 mb-4"
                />
                </div>
                <div className="mb-2">
                    <button 
                    onClick={handleSearchClick} 
                    disabled={isLoading}
                    className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600">
                    {isLoading ? "Searching..." : "Search the Pokemon!"}
                </button>
                </div>

                {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
            <div>
                {pokemonData && (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">{pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
                        <div className="flex justify-center">
                        <img src={pokemonData.sprites.front_default} alt={pokemonData.name} className="max-w-xs" />
                        </div>
                        {pokemonData.typeName && (
                            <p className="text-gray-700 mt-2">
                                {pokemonData.typeName}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default PokemonFinder;