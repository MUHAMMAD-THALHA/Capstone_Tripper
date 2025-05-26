import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { aiService } from '../services/aiService';

const AIAutocomplete = ({
  placeholder,
  onSelect,
  type = 'destination', // 'destination', 'tour', 'recommendation'
  className = '',
}) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedInput = useDebounce(input, 300);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedInput) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        let results = [];
        switch (type) {
          case 'destination':
            results = await aiService.getDestinationSuggestions(debouncedInput);
            break;
          case 'tour':
            results = await aiService.getTourSuggestions(debouncedInput);
            break;
          case 'recommendation':
            results = await aiService.getPersonalizedRecommendations({ query: debouncedInput });
            break;
          default:
            results = [];
        }
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedInput, type]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.name || suggestion.title);
    setShowSuggestions(false);
    onSelect(suggestion);
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink focus:border-transparent"
      />
      
      {showSuggestions && (input || isLoading) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-2 text-center text-gray-500">Loading suggestions...</div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion.name || suggestion.title}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2 text-center text-gray-500">No suggestions found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAutocomplete; 