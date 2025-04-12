import { Link } from "expo-router";
import MaskedView from "@react-native-masked-view/masked-view";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

const TrendingCard = ({
  movie: { movie_id, title, poster, count },
  index,
}: TrendingCardProps) => {
  console.log('TrendingCard Props:', { movie_id, title, poster, count, index });

  if (!poster) {
    console.warn('Missing poster for movie:', { movie_id, title });
  }

  return (
    <Link href={`/movie/${movie_id}`} asChild>
      <TouchableOpacity className="w-[280px] relative">
        <MaskedView
          maskElement={
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={{ flex: 1 }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          }
        >
          <Image
            source={{ 
              uri: poster || "https://placehold.co/600x400/1a1a1a/FFFFFF.png"
            }}
            className="w-full h-[400px] rounded-xl"
            resizeMode="cover"
            onError={(e) => console.error('Image loading error:', e.nativeEvent.error)}
          />
        </MaskedView>

        <View className="absolute bottom-4 left-4 right-4">
          <View className="flex-row items-center gap-x-2 mb-2">
            <Text className="text-xs text-white font-bold px-2 py-1 rounded bg-accent">
              #{index + 1} Trending
            </Text>
          </View>

          <Text className="text-xl text-white font-bold" numberOfLines={1}>
            {title}
          </Text>

          <View className="flex-row items-center gap-x-2 mt-2">
            <View className="flex-row items-center gap-x-1">
              <Image source={icons.star} className="w-4 h-4" />
              <Text className="text-xs text-white font-bold">
                {count} searches
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default TrendingCard;