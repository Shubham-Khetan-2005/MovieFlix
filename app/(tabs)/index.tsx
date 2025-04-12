import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import React from "react";

import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";
import useFetch from "@/services/useFetch";

const Index = () => {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  console.log('Home Page State:', {
    trendingMovies,
    trendingLoading,
    trendingError: trendingError?.message || trendingError,
    platform: Platform.OS
  });

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        <View className="flex-1 mt-5">
          <SearchBar
            onPress={() => {
              router.push("/search");
            }}
            placeholder="Search for a movie"
          />

          {/* Trending Movies Section */}
          <View className="mt-10">
            <Text className="text-lg text-white font-bold mb-3">
              Trending Movies
            </Text>
            {trendingLoading ? (
              <ActivityIndicator size="small" color="#AB8BFF" />
            ) : trendingError ? (
              <Text className="text-red-500">Error loading trending movies: {String(trendingError)}</Text>
            ) : !trendingMovies || trendingMovies.length === 0 ? (
              <Text className="text-light-200">No trending movies found</Text>
            ) : (
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4 mt-3"
                data={trendingMovies}
                contentContainerStyle={{
                  gap: 26,
                }}
                renderItem={({ item, index }) => {
                  console.log('Rendering trending item:', {
                    movieId: item.movie_id,
                    title: item.title,
                    poster: item.poster?.substring(0, 50),
                    count: item.count
                  });
                  return <TrendingCard movie={item} index={index} />;
                }}
                keyExtractor={(item) => item.movie_id.toString()}
                ItemSeparatorComponent={() => <View className="w-4" />}
              />
            )}
          </View>

          {/* Latest Movies Section */}
          <View className="mt-5">
            <Text className="text-lg text-white font-bold mb-3">
              Latest Movies
            </Text>
            {moviesLoading ? (
              <ActivityIndicator size="small" color="#AB8BFF" />
            ) : moviesError ? (
              <Text className="text-red-500">Error loading movies: {String(moviesError)}</Text>
            ) : !movies || movies.length === 0 ? (
              <Text className="text-light-200">No movies found</Text>
            ) : (
              <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;