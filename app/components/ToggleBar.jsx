import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ToggleBar = () => {
  return (
    <div>
      <h2>My Menu</h2>
      <FontAwesomeIcon icon={faTimes} />
    </div>
  )
}

export default ToggleBar
