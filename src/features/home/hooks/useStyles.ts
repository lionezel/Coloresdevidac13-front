import { useMemo } from "react";

export interface StyleItem {
    id: number;
    iconRight: string;
    iconLeft: string;
}

export const useStyles = () => {
    const style = useMemo<StyleItem[]>(() => [
        {
            id: 1,
            iconRight: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", // Pikachu as placeholder
            iconLeft: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",   // Charmander as placeholder
        }
    ], []);

    return { style };
};
