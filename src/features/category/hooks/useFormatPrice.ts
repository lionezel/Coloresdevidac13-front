export const useFormatPrice = () => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return { formatPrice };
};
