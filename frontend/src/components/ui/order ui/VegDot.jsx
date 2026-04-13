function VegDot({ isVeg }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-sm border-2 flex-shrink-0 mr-1.5 ${
        isVeg ? "border-green-600 bg-green-500" : "border-red-600 bg-red-500"
      }`}
    />
  );
}

export default VegDot;