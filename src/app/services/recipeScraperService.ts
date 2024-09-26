import axios from 'axios';

export interface ScrapedRecipe {
  author: string;
  canonical_url: string;
  category: string;
  cuisine: string;
  description: string;
  equipment: { [key: string]: string };
  image: string;
  ingredient_groups: { [key: string]: string[] };
  ingredients: string[];
  instructions: string;
  language: string;
  nutrients: { [key: string]: string };
  ratings: number;
  site_name: string;
  title: string;
  total_time: number;
  yields: string;
}

export interface ProcessedIngredients {
  [line: string]: {
    [label: string]: string[];
  };
}

export class RecipeScraperService {
  private apiUrl: string;

  constructor(apiUrl: string = 'http://127.0.0.1:5000') {
    this.apiUrl = apiUrl;
  }

  async scrapeRecipe(url: string): Promise<ScrapedRecipe> {
    try {
      const response = await axios.get(`${this.apiUrl}/tasks/scrape_recipe`, {
        params: { recipeUrl: url },
      });
      console.log('Scraped recipe:', response.data.result);
      return response.data.result;
    } catch (error) {
      console.error('Error scraping recipe:', error);
      throw new Error('Failed to scrape recipe');
    }
  }

  async scrapeIngredientsWithNER(url: string): Promise<ProcessedIngredients> {
    try {
      const response = await axios.post(`${this.apiUrl}/api/scrape-ingredients-ner`, {
        url,
      });
      return response.data;
    } catch (error) {
      console.error('Error scraping ingredients with NER:', error);
      throw new Error('Failed to scrape ingredients with NER');
    }
  }
}

const recipeScraperService = new RecipeScraperService();
export default recipeScraperService;