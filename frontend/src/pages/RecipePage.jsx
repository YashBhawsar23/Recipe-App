// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const RecipePage = () => {
//   const { id } = useParams();
//   const [recipe, setRecipe] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchRecipe = async () => {
//       try {
//         const response = await fetch(
//           `https://api.spoonacular.com/recipes/${id}/information?apiKey=7871aee4228c46d7847f67c65ec4d48c`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch recipe");
//         }
//         const data = await response.json();
//         setRecipe(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRecipe();
//   }, [id]);

//   if (loading) return <p className="text-center text-gray-500">Loading...</p>;
//   if (error) return <p className="text-center text-red-500">Error: {error}</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-gray-800">{recipe.title}</h1>
//       <img
//         src={recipe.image}
//         alt={recipe.title}
//         className="w-full h-80 object-cover rounded-lg my-4"
//       />
//       <h2 className="text-xl font-semibold text-gray-700 mt-4">Ingredients</h2>
//       <ul className="list-disc list-inside text-gray-600">
//         {recipe.extendedIngredients.map((ingredient) => (
//           <li key={ingredient.id}>{ingredient.original}</li>
//         ))}
//       </ul>
//       <h2 className="text-xl font-semibold text-gray-700 mt-4">Instructions</h2>
//       <p className="text-gray-600 mt-2">{recipe.instructions}</p>
//     </div>
//   );
// };

// export default RecipePage;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ingredients");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=7871aee4228c46d7847f67c65ec4d48c`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recipe");
        }
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-red-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-red-800">
            Something went wrong
          </h2>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-300"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderNutrition = () => {
    if (!recipe.nutrition || !recipe.nutrition.nutrients)
      return <p>No nutrition information available</p>;

    const keysToShow = [
      "Calories",
      "Fat",
      "Carbohydrates",
      "Protein",
      "Fiber",
      "Sugar",
    ];
    const filteredNutrients = recipe.nutrition.nutrients.filter((item) =>
      keysToShow.includes(item.name)
    );

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredNutrients.map((nutrient) => (
          <div
            key={nutrient.name}
            className="bg-green-50 p-3 rounded-lg text-center"
          >
            <p className="font-semibold text-green-800">{nutrient.name}</p>
            <p className="text-green-600">
              {nutrient.amount} {nutrient.unit}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const parseInstructions = (instructions) => {
    if (!instructions) return ["No instructions available"];

    // Try to split by numbers or line breaks
    const steps = instructions
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .split(/\d+\.\s|\n/)
      .filter((step) => step.trim().length > 0);

    return steps.length ? steps : ["Instructions format not recognized"];
  };

  const instructionsArray = parseInstructions(recipe.instructions);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Hero Section */}
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-lg"></div>
        <div className="absolute bottom-0 left-0 p-4 md:p-6">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
            {recipe.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-white">
            <span className="bg-green-600 py-1 px-3 rounded-full text-sm flex items-center">
              <span className="mr-1">⏱️</span>
              {recipe.readyInMinutes} mins
            </span>
            <span className="bg-orange-600 py-1 px-3 rounded-full text-sm flex items-center">
              <span className="mr-1">🔥</span>
              {recipe.healthScore} health score
            </span>
            <span className="bg-blue-600 py-1 px-3 rounded-full text-sm flex items-center">
              <span className="mr-1">👨‍👩‍👧‍👦</span>
              {recipe.servings} servings
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mt-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("ingredients")}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "ingredients"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Ingredients
          </button>
          <button
            onClick={() => setActiveTab("instructions")}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "instructions"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Cooking Steps
          </button>
          <button
            onClick={() => setActiveTab("nutrition")}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "nutrition"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Nutrition
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === "ingredients" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🧂</span>
              Ingredients
            </h2>
            <ul className="space-y-3">
              {recipe.extendedIngredients.map((ingredient) => (
                <li key={ingredient.id} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-700">{ingredient.original}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "instructions" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📝</span>
              Cooking Steps
            </h2>
            <ol className="space-y-6">
              {instructionsArray.map((step, index) => (
                <li key={index} className="flex">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center mr-4 text-white font-medium">
                    {index + 1}
                  </div>
                  <div className="text-gray-700">{step}</div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {activeTab === "nutrition" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🥗</span>
              Nutrition Information
            </h2>
            {renderNutrition()}
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Additional Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Vegetarian</p>
            <p className="font-medium text-gray-800">
              {recipe.vegetarian ? "Yes" : "No"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Vegan</p>
            <p className="font-medium text-gray-800">
              {recipe.vegan ? "Yes" : "No"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gluten Free</p>
            <p className="font-medium text-gray-800">
              {recipe.glutenFree ? "Yes" : "No"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Dairy Free</p>
            <p className="font-medium text-gray-800">
              {recipe.dairyFree ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
