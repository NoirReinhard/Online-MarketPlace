import { faHouse, faCarrot, faUser } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export const nav = [
  { title: "Home", icon: <FontAwesomeIcon icon={faHouse} /> },
  { title: "Products", icon: <FontAwesomeIcon icon={faCarrot} /> },
  { title: "About Us", icon: <FontAwesomeIcon icon={faUser} /> },
  
];
export const Logo=[
  {
    logo: <FontAwesomeIcon icon={faFacebook} />,
  },
  {
    logo: <FontAwesomeIcon icon={faTwitter} />,
  },
  {
    logo: <FontAwesomeIcon icon={faInstagram} />,
  }
]
