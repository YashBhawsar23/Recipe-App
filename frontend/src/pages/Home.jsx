import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Vegetarian",
    "Quick & Easy",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Spoonacular API key
  const API_KEY = "7871aee4228c46d7847f67c65ec4d48c";
  const BASE_URL = "https://api.spoonacular.com";

  // Fetch initial popular recipes when component mounts
  useEffect(() => {
    fetchPopularRecipes();
  }, []);

  // Fetch recipes by category when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      fetchRecipesByCategory(selectedCategory);
    } else {
      fetchPopularRecipes();
    }
  }, [selectedCategory]);

  const fetchPopularRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/recipes/random?number=6&apiKey=${API_KEY}`
      );
      const data = await response.json();

      if (data.recipes) {
        const formattedRecipes = data.recipes.map((recipe) => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image || "/api/placeholder/300/200",
          time: `${recipe.readyInMinutes} min`,
          difficulty: getDifficultyLevel(recipe.readyInMinutes),
          rating: recipe.spoonacularScore
            ? (recipe.spoonacularScore / 20).toFixed(1)
            : 4.5,
          isFavorite: false,
        }));
        setRecipes(formattedRecipes);
      }
    } catch (error) {
      console.error("Error fetching popular recipes:", error);
      // Fall back to sample data in case of API error
      setRecipes(getSampleRecipes());
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipesByCategory = async (category) => {
    setLoading(true);
    try {
      const categoryTagMap = {
        Breakfast: "breakfast",
        Lunch: "lunch",
        Dinner: "dinner",
        Dessert: "dessert",
        Vegetarian: "vegetarian",
        "Quick & Easy": "quick",
      };

      const tag = categoryTagMap[category] || category.toLowerCase();

      const response = await fetch(
        `${BASE_URL}/recipes/complexSearch?query=${tag}&number=6&apiKey=${API_KEY}`
      );
      const data = await response.json();

      if (data.results) {
        const detailedRecipes = await Promise.all(
          data.results.map(async (recipePreview) => {
            try {
              const detailResponse = await fetch(
                `${BASE_URL}/recipes/${recipePreview.id}/information?apiKey=${API_KEY}`
              );
              const recipeDetail = await detailResponse.json();

              return {
                id: recipeDetail.id,
                title: recipeDetail.title,
                image: recipeDetail.image || "/api/placeholder/300/200",
                time: `${recipeDetail.readyInMinutes} min`,
                difficulty: getDifficultyLevel(recipeDetail.readyInMinutes),
                rating: recipeDetail.spoonacularScore
                  ? (recipeDetail.spoonacularScore / 20).toFixed(1)
                  : 4.5,
                isFavorite: false,
              };
            } catch (error) {
              console.error(
                `Error fetching details for recipe ${recipePreview.id}:`,
                error
              );
              return null;
            }
          })
        );

        setRecipes(detailedRecipes.filter((recipe) => recipe !== null));
      }
    } catch (error) {
      console.error("Error fetching recipes by category:", error);
      // Fall back to sample data
      setRecipes(getSampleRecipes());
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/recipes/complexSearch?query=${searchQuery}&number=6&apiKey=${API_KEY}`
      );
      const data = await response.json();

      if (data.results) {
        const detailedRecipes = await Promise.all(
          data.results.map(async (recipePreview) => {
            try {
              const detailResponse = await fetch(
                `${BASE_URL}/recipes/${recipePreview.id}/information?apiKey=${API_KEY}`
              );
              const recipeDetail = await detailResponse.json();

              return {
                id: recipeDetail.id,
                title: recipeDetail.title,
                image: recipeDetail.image || "/api/placeholder/300/200",
                time: `${recipeDetail.readyInMinutes} min`,
                difficulty: getDifficultyLevel(recipeDetail.readyInMinutes),
                rating: recipeDetail.spoonacularScore
                  ? (recipeDetail.spoonacularScore / 20).toFixed(1)
                  : 4.5,
                isFavorite: false,
              };
            } catch (error) {
              console.error(
                `Error fetching details for recipe ${recipePreview.id}:`,
                error
              );
              return null;
            }
          })
        );

        setRecipes(detailedRecipes.filter((recipe) => recipe !== null));
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
      // Fall back to filtered sample data
      const filteredSamples = getSampleRecipes().filter((recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setRecipes(
        filteredSamples.length > 0 ? filteredSamples : getSampleRecipes()
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine difficulty based on cooking time
  const getDifficultyLevel = (minutes) => {
    if (minutes < 20) return "Easy";
    if (minutes < 40) return "Medium";
    return "Hard";
  };

  // Function to get sample recipes as fallback
  const getSampleRecipes = () => {
    return [
      {
        id: 1,
        title: "Classic Spaghetti Carbonara",
        image: "/api/placeholder/300/200",
        time: "30 min",
        difficulty: "Medium",
        rating: 4.8,
        isFavorite: false,
      },
      {
        id: 2,
        title: "Avocado & Egg Toast",
        image: "/api/placeholder/300/200",
        time: "15 min",
        difficulty: "Easy",
        rating: 4.5,
        isFavorite: false,
      },
      {
        id: 3,
        title: "Vegetable Stir Fry",
        image: "/api/placeholder/300/200",
        time: "25 min",
        difficulty: "Easy",
        rating: 4.6,
        isFavorite: false,
      },
      {
        id: 4,
        title: "Chicken Tikka Masala",
        image: "/api/placeholder/300/200",
        time: "45 min",
        difficulty: "Medium",
        rating: 4.9,
        isFavorite: false,
      },
      {
        id: 5,
        title: "Chocolate Lava Cake",
        image: "/api/placeholder/300/200",
        time: "40 min",
        difficulty: "Hard",
        rating: 4.7,
        isFavorite: false,
      },
      {
        id: 6,
        title: "Greek Salad",
        image: "/api/placeholder/300/200",
        time: "20 min",
        difficulty: "Easy",
        rating: 4.4,
        isFavorite: false,
      },
    ];
  };

  const toggleFavorite = (id) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === id
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );
  };

  // Function to view recipe details
  const viewRecipeDetails = (id) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg
              className="h-8 w-8 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <h1 className="ml-2 text-xl font-bold text-gray-900">
              Culinary Compass
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-900 hover:text-red-500">
              Home
            </Link>
            <Link to="/" className="text-gray-500 hover:text-red-500">
              Favorites
            </Link>
            <Link to="/" className="text-gray-500 hover:text-red-500">
              My Recipes
            </Link>
            <Link to="/signup" className="text-gray-500 hover:text-red-500">
              Profile
            </Link>
          </nav>
          <button className="md:hidden">
            <svg
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Find the Perfect Recipe
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Discover thousands of recipes from around the world, save your
              favorites, and cook like a pro!
            </p>

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="max-w-3xl mx-auto relative"
            >
              <div className="flex items-center rounded-full bg-white shadow-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search for recipes, ingredients, or cuisine..."
                  className="w-full py-4 px-6 text-gray-700 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 focus:outline-none"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() =>
                setSelectedCategory(
                  category === selectedCategory ? "" : category
                )
              }
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          {searchQuery && !loading
            ? `Results for "${searchQuery}"`
            : selectedCategory
            ? `${selectedCategory} Recipes`
            : "Popular Recipes"}
        </h3>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              No recipes found. Try a different search term or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(recipe.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow"
                  >
                    <svg
                      className={`h-5 w-5 ${
                        recipe.isFavorite ? "text-red-500" : "text-gray-400"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {recipe.title}
                  </h4>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>{recipe.time}</span>
                    <span>{recipe.difficulty}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-4 w-4"
                          fill={
                            i < Math.floor(recipe.rating)
                              ? "currentColor"
                              : "none"
                          }
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.934l-6.18 3.249 1.18-6.881L.998 7.492l6.902-1.001L10 .25l2.1 6.241 6.902 1.001-4.902 4.81 1.18 6.881z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {recipe.rating}
                    </span>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <button
                    onClick={() => viewRecipeDetails(recipe.id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-medium transition-colors duration-300"
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Culinary Compass</h4>
              <p className="text-gray-300">
                Find, save, and share the best recipes from around the world.
              </p>
              <p className="text-gray-300 mt-2">Powered by Spoonacular API</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link to="/" className="hover:text-red-400">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-red-400">
                    Favorites
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-red-400">
                    My Recipes
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-red-400">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© 2025 Culinary Compass. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
