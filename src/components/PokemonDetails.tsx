import React, { useEffect, useState } from "react";
import axios from "axios";

interface PokemonDetailsProps {
  pokemonData: {
    name: string;
    sprites: {
      other: {
        "official-artwork": {
          front_default: string;
        };
      };
    };
    weight: number;
    height: number;
    types: {
      type: {
        name: string;
      };
    }[];
  };
}

const PokemonDetails: React.FC<PokemonDetailsProps> = ({ pokemonData }) => {
  const [encounterData, setEncounterData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch encounter data when the component mounts
    const fetchEncounterData = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonData.name}/encounters`);
        const formattedData = response.data.map((encounter: any) => {
          const locationName = encounter.location_area.name
            .split("-")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          return locationName;
        });
        setEncounterData(formattedData);
      } catch (error) {
        console.error("Error fetching encounter data:", error);
      }
    };

    fetchEncounterData();
  }, [pokemonData]);

  return (
    <div className="lg:mt-4 text-left lg:text-center flex flex-col lg:flex-row">
      <div className="lg:w-1/2 lg:pr-6">
        <h2 className="text-xl font-semibold mb-2">
          {pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}
        </h2>
        <div className="flex justify-center">
          <img
            src={pokemonData.sprites.other["official-artwork"].front_default}
            alt={pokemonData.name}
            className="max-w-xs"
          />
        </div>
      </div>
      <div className="lg:w-1/2">
        <div className="mb-2">
          <p className="mb-2">Weight: {pokemonData.weight}</p>
          <p className="mb-2">Height: {pokemonData.height}</p>
          <p className="mb-2">Type: {pokemonData.types[0].type.name}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Encounters</h2>
          <ul>
            {encounterData.map((encounter: string, index: number) => (
              <li key={index}>{encounter}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
