import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

const Button = ({ text, route }) => {
    const navigate = useNavigate()

    return (
        <button
            onClick={() => navigate(route)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg 
            transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
        >
            {text}
        </button>
    )
}

Button.propTypes = {
    text: PropTypes.string.isRequired,
    route: PropTypes.string.isRequired
}

export default Button