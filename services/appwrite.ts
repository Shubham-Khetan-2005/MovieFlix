import 'react-native-url-polyfill/auto';
import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    console.log('Attempting to update search count:', { query, movieId: movie.id });
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      console.log('Updating existing movie:', existingMovie.$id);
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      );
    } else {
      console.log('Creating new movie document');
      const newDoc = await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
      console.log('Created new document:', newDoc.$id);
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    console.log('Fetching trending movies...');
    console.log('Using Database ID:', DATABASE_ID);
    console.log('Using Collection ID:', COLLECTION_ID);
    
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    console.log('Trending movies result:', result.documents);
    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return undefined;
  }
};