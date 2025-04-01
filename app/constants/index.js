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
export const slides = [
  {
    id: 1,
    image: "/assets/StrawberryPie.jpg",
    title: "Fresh & Juicy Fruits",
    text: "Taste the freshness in every bite.",
  },
  {
    id: 2,
    image: "/assets/Spices.jpeg",
    title: "Organic Goodness",
    text: "Nature’s best, delivered to you.",
  },
];
export const filter=[
  {
    title:"🍪 Bakery",
    link:"/search/bakery"
  },
  {
    title:"🥛 Dairy",
    link:"/search/dairy"
  },
  {
    title:"🥕 Vegetables",
    link:"/search/vegetable"
  },
  {
    title:"🍹 Beverages",
    link:"/search/beverages"
  },
  {
    title:"🌶 Spices",
    link:"/search/spices"
  },
  {
    title:"🥜 Nuts",
    link:"/search/nuts"
  },
  {
    title:"🌱 Pulses",
    link:"/search/pulse"
  },
  {
    title:"🥭 Fruits",
    link:"/search/fruit"
  }
]
