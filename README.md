# Ingredient Cart

Welcome to Ingredient Cart, a Next.js project utilizing NextUI for a seamless front-end experience. This application automates the process of adding recipe ingredients to your Kroger shopping cart, saving you valuable time and effort. [Live Deployment Here](https://ingredient-cart.vercel.app/sign-in?redirect_url=https%3A%2F%2Fingredient-cart.vercel.app%2F)

## How it Works

Ingredient Cart streamlines your grocery shopping experience by performing the following steps:

1. **Input Recipe URL**: Simply insert the URL of the recipe you wish to prepare.
2. **Scrape Ingredients**: The application automatically scrapes the ingredients from the provided recipe URL.
3. **Integration with Kroger API**: Utilizing the Kroger third-party API service, Ingredient Cart searches for and adds the scraped ingredients directly to your Kroger shopping cart.

## Setup Instructions

To set up Ingredient Cart locally, follow these steps:

1. **Clone the Repository**: Start by cloning this repository to your local machine using the following command:
   ```
   git clone git@github.com:JackHimes/ingredient-cart-frontend.git
   ```
2. **Install Dependencies**: Navigate into the cloned repository directory and run the following command to install the necessary dependencies:
   ```
   npm install
   ```
3. **Start the Development Server**: Once the dependencies are installed, start the development server using the following command:
   ```
   npm run dev
   ```
4. **Access the Application**: Open your web browser and visit `http://localhost:3000` to access Ingredient Cart.

## Technologies Used

Ingredient Cart leverages the following technologies:

- **Next.js**: A React framework for building server-rendered applications.
- **NextUI**: A component library for Next.js, providing pre-styled and customizable UI components.
- **Kroger API**: Integration with the Kroger third-party API service for adding items to the shopping cart.

## License

This project is licensed under the [MIT License](LICENSE).