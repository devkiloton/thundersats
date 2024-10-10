import { FC } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Chip, useTheme } from "react-native-paper";
import { CategoriesEnum } from "../constants/categories";

type CategoryCarouselProps = {
  categories: Array<{ name: CategoriesEnum; icon: string }>;
  activeCategory: CategoriesEnum | null;
  onChange?: (category: CategoriesEnum | null) => void;
};

export const CategoryCarousel: FC<CategoryCarouselProps> = ({
  categories,
  activeCategory,
  onChange,
}) => {
  const theme = useTheme();
  return (
    <FlatList
      style={{ maxHeight: 32, borderRadius: 16 }}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalFlatlist}
      renderItem={(data) => {
        return (
          <Chip
            style={{
              borderRadius: 16,
              backgroundColor:
                activeCategory === data.item.name
                  ? theme.colors.inversePrimary
                  : theme.colors.primaryContainer,
            }}
            showSelectedOverlay={true}
            showSelectedCheck
            icon={data.item.icon}
            onPress={() =>
              onChange?.(
                data.item.name === activeCategory ? null : data.item.name
              )
            }
          >
            {data.item.name}
          </Chip>
        );
      }}
      horizontal
      data={categories}
      keyExtractor={(item) => item.name}
    />
  );
};

const styles = StyleSheet.create({
  horizontalFlatlist: {
    flexDirection: "row",
    gap: 8,
  },
});
