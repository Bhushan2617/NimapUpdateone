import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Navbar from "./components/Navbar";
import CategoryList from "./components/CategoryList";
import ProductList from "./components/ProductList";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<CategoryList />} />
              <Route path="/products" element={<ProductList />} />
            </Routes>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
