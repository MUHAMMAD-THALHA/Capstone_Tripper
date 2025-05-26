import { motion } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaClock, FaTag } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TourCard = ({ tour }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative h-48">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-blue-600">
          ${tour.price}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{tour.title}</h3>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="text-gray-600">{tour.rating}</span>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-2" />
            <span>{tour.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaClock className="mr-2" />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaTag className="mr-2" />
            <span>{tour.category}</span>
          </div>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
        <Link
          to={`/tours/${tour.id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default TourCard; 