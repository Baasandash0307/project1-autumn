import { BlurView } from "expo-blur";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type Dish = {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: string;
  time: string;
  description: string;
};

type Tab = "home" | "favorites" | "cart";

const GAP = 14;
const burgerImage = require("../../assets/images/burger1.png");

const categories = ["All", "Classic", "Cheese", "Spicy"];

const dishes: Dish[] = [
  {
    id: 1,
    name: "Classic Burger",
    category: "Classic",
    price: 15900,
    rating: "4.9",
    time: "15 min",
    description:
      "Шүүслэг үхрийн мах, шинэ ногоо, бяслаг болон тусгай соустай бургер.",
  },
  {
    id: 2,
    name: "Double Cheese",
    category: "Cheese",
    price: 19900,
    rating: "4.8",
    time: "20 min",
    description: "Давхар мах, хайлсан бяслагтай амтлаг бургер.",
  },
  {
    id: 3,
    name: "Spicy Burger",
    category: "Spicy",
    price: 17900,
    rating: "4.7",
    time: "15 min",
    description: "Халуун ногоотой соус, шаржигнуур ногоотой бургер.",
  },
  {
    id: 4,
    name: "Cheese Special",
    category: "Cheese",
    price: 21900,
    rating: "4.9",
    time: "20 min",
    description: "Бяслагт дуртай хүмүүст зориулсан тусгай бургер.",
  },
];

const tabs = [
  { key: "home", icon: "⌂", label: "Home" },
  { key: "favorites", icon: "♡", label: "Favorites" },
  { key: "cart", icon: "🛒", label: "Cart" },
] as const;

const money = (value: number) => `${value.toLocaleString()}₮`;

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [tab, setTab] = useState<Tab>("home");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [selected, setSelected] = useState<Dish | null>(null);
  const [gridWidth, setGridWidth] = useState(0);
  const insets = useSafeAreaInsets();

  const cardWidth = Math.max(0, (gridWidth - GAP) / 2);

  const toggleFavorite = (id: number) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const addToCart = (id: number) => {
    setCart((previous) => [...previous, id]);
  };

  const removeFromCart = (id: number) => {
    setCart((previous) => {
      const next = [...previous];
      const index = next.indexOf(id);
      if (index !== -1) next.splice(index, 1);
      return next;
    });
  };

  const visibleDishes = dishes.filter((dish) => {
    const matchesSearch = dish.name
      .toLowerCase()
      .includes(query.trim().toLowerCase());

    const matchesCategory = category === "All" || dish.category === category;

    const matchesTab =
      tab === "home" ||
      (tab === "favorites" && favorites.includes(dish.id)) ||
      (tab === "cart" && cart.includes(dish.id));

    return matchesSearch && matchesTab && (tab !== "home" || matchesCategory);
  });

  const total = cart.reduce(
    (sum, id) => sum + (dishes.find((dish) => dish.id === id)?.price ?? 0),
    0,
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.muted}>Welcome back</Text>
            <Text style={styles.brand}>Foodie.</Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>F</Text>
          </View>
        </View>

        <View style={styles.search}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Find your dishes"
            placeholderTextColor="#777B89"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            selectionColor="#FF7668"
          />
          {query.length > 0 && (
            <Pressable
              hitSlop={10}
              onPress={() => setQuery("")}
              accessibilityLabel="Clear search"
            >
              <Text style={styles.clear}>×</Text>
            </Pressable>
          )}
        </View>

        {tab === "home" && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <Pressable onPress={() => setCategory("All")}>
                <Text style={styles.accent}>All →</Text>
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categories}
            >
              {categories.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setCategory(item)}
                  style={[styles.chip, category === item && styles.activeChip]}
                >
                  <Text style={styles.chipText}>
                    {item === "All" ? "🍔  All dishes" : item}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {tab === "home"
              ? "Popular dishes"
              : tab === "favorites"
                ? "Your favorites"
                : "Your cart"}
          </Text>
          <Text style={styles.muted}>{visibleDishes.length} dishes</Text>
        </View>

        {/* Card-ийн өргөнийг энэ View-ийн хэмжээнээс тооцно. */}
        <View
          style={styles.grid}
          onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
        >
          {gridWidth > 0 &&
            visibleDishes.map((dish) => {
              const quantity = cart.filter((id) => id === dish.id).length;

              return (
                <Pressable
                  key={dish.id}
                  style={[styles.card, { width: cardWidth }]}
                  onPress={() => setSelected(dish)}
                >
                  <View style={styles.plate}>
                    <Image
                      source={burgerImage}
                      style={styles.foodImage}
                      resizeMode="contain"
                    />
                  </View>

                  <Text style={styles.dishName}>{dish.name}</Text>

                  <Text style={styles.metadata}>
                    ★ {dish.rating} · {dish.time}
                  </Text>

                  <View style={styles.cardBottom}>
                    <Text style={styles.price}>{money(dish.price)}</Text>

                    <Pressable
                      hitSlop={10}
                      accessibilityLabel="Toggle favorite"
                      onPress={(event) => {
                        event.stopPropagation();
                        toggleFavorite(dish.id);
                      }}
                    >
                      <Text
                        style={[
                          styles.heart,
                          favorites.includes(dish.id) && styles.accent,
                        ]}
                      >
                        {favorites.includes(dish.id) ? "♥" : "♡"}
                      </Text>
                    </Pressable>
                  </View>

                  {tab === "cart" && (
                    <View style={styles.quantityRow}>
                      <Pressable
                        hitSlop={8}
                        onPress={(event) => {
                          event.stopPropagation();
                          removeFromCart(dish.id);
                        }}
                      >
                        <Text style={styles.quantityButton}>−</Text>
                      </Pressable>

                      <Text style={styles.chipText}>{quantity}</Text>

                      <Pressable
                        hitSlop={8}
                        onPress={(event) => {
                          event.stopPropagation();
                          addToCart(dish.id);
                        }}
                      >
                        <Text style={styles.quantityButton}>+</Text>
                      </Pressable>
                    </View>
                  )}
                </Pressable>
              );
            })}
        </View>

        {visibleDishes.length === 0 && (
          <Text style={styles.empty}>
            {tab === "favorites"
              ? "Дуртай хоолоо ♡ дарж нэмээрэй."
              : tab === "cart"
                ? "Таны сагс хоосон байна."
                : "Хоол олдсонгүй."}
          </Text>
        )}

        {tab === "cart" && cart.length > 0 && (
          <View style={styles.total}>
            <Text style={styles.sectionTitle}>Total</Text>
            <Text style={styles.price}>{money(total)}</Text>
          </View>
        )}
      </ScrollView>

      {/* ScrollView-ийн дараа байрласан blur navigation. */}
      <View
        pointerEvents={selected ? "none" : "auto"}
        style={[styles.navigation, selected && styles.navigationHidden]}
      >
        <BlurView
          intensity={75}
          tint="dark"
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {tabs.map((item) => (
          <Pressable
            key={item.key}
            style={styles.navItem}
            onPress={() => {
              setTab(item.key);
              setQuery("");
            }}
          >
            <Text style={[styles.navIcon, tab === item.key && styles.accent]}>
              {item.icon}
            </Text>
            <Text style={[styles.navLabel, tab === item.key && styles.accent]}>
              {item.label}
              {item.key === "cart" && cart.length > 0
                ? ` (${cart.length})`
                : ""}
            </Text>
          </Pressable>
        ))}
      </View>

      <Modal
        visible={selected !== null}
        animationType="slide"
        onRequestClose={() => setSelected(null)}
        statusBarTranslucent
      >
        {selected && (
          <View
            style={[
              styles.screen,
              {
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
              },
            ]}
          >
            <View style={styles.detailHeader}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back"
                onPress={() => setSelected(null)}
                style={styles.headerButton}
              >
                <Text style={styles.back}>‹</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Toggle favorite"
                onPress={() => toggleFavorite(selected.id)}
                style={styles.headerButton}
              >
                <Text
                  style={[
                    styles.heart,
                    favorites.includes(selected.id) && styles.accent,
                  ]}
                >
                  {favorites.includes(selected.id) ? "♥" : "♡"}
                </Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.detailContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.largePlate}>
                <Image
                  source={burgerImage}
                  style={styles.largeImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.detailTitle}>{selected.name}</Text>
              <Text style={styles.description}>{selected.description}</Text>
              <Text style={styles.metadata}>
                ★ {selected.rating} · {selected.time}
              </Text>

              <Text style={styles.ingredientTitle}>Ingredients</Text>

              <View style={styles.ingredients}>
                {["🥩 Beef", "🥬 Lettuce", "🧀 Cheese"].map((item) => (
                  <View key={item} style={styles.ingredient}>
                    <Text style={styles.chipText}>{item}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View style={styles.detailFooter}>
              <View>
                <Text style={styles.muted}>Price</Text>
                <Text style={styles.price}>{money(selected.price)}</Text>
              </View>

              <Pressable
                style={styles.addButton}
                onPress={() => {
                  addToCart(selected.id);
                  setSelected(null);
                }}
              >
                <Text style={styles.addText}>+ Add to cart</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#24262F",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 140,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  muted: {
    color: "#9094A3",
    fontSize: 12,
  },
  brand: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 5,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#FF7668",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#24262F",
    fontSize: 23,
    fontWeight: "800",
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E2028",
    borderRadius: 18,
    paddingHorizontal: 18,
    height: 58,
  },
  searchIcon: {
    color: "#FF7668",
    fontSize: 30,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
  },
  clear: {
    color: "#9094A3",
    fontSize: 25,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "600",
  },
  accent: {
    color: "#FF7668",
  },
  categories: {
    gap: 10,
  },
  chip: {
    backgroundColor: "#32353F",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeChip: {
    backgroundColor: "#443333",
    borderColor: "#FF7668",
  },
  chipText: {
    color: "#E3E4EB",
    fontSize: 13,
  },

  // Өргөнийг JSX дотор cardWidth-ээр өгсөн.
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: GAP,
  },
  card: {
    backgroundColor: "#32353F",
    borderRadius: 24,
    padding: 12,
  },
  plate: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 200,
    backgroundColor: "#1D1F25",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#41444F",
  },
  foodImage: {
    width: "92%",
    height: "92%",
  },
  dishName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  metadata: {
    color: "#9094A3",
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  price: {
    color: "#FF7668",
    fontSize: 17,
    fontWeight: "700",
  },
  heart: {
    color: "#B1B5C3",
    fontSize: 26,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  quantityButton: {
    color: "#FF7668",
    fontSize: 25,
  },
  empty: {
    color: "#9094A3",
    textAlign: "center",
    paddingVertical: 40,
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },

  navigation: {
    position: "absolute",
    bottom: 32,
    left: 20,
    right: 20,
    zIndex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "rgba(30,32,40,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  navigationHidden: {
    opacity: 0,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  navIcon: {
    color: "#9094A3",
    fontSize: 25,
  },
  navLabel: {
    color: "#9094A3",
    fontSize: 10,
  },

  detailHeader: {
    zIndex: 2,
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  back: {
    color: "#FFFFFF",
    fontSize: 36,
    lineHeight: 40,
    includeFontPadding: false,
  },
  detailContent: {
    padding: 24,
    alignItems: "center",
  },
  largePlate: {
    width: "90%",
    aspectRatio: 1,
    backgroundColor: "#1D1F25",
    borderRadius: 200,
    borderWidth: 3,
    borderColor: "#41444F",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  largeImage: {
    width: "92%",
    height: "92%",
  },
  detailTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },
  description: {
    color: "#9094A3",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 14,
    marginBottom: 8,
  },
  ingredientTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    alignSelf: "flex-start",
    marginTop: 36,
    marginBottom: 16,
  },
  ingredients: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  ingredient: {
    backgroundColor: "#32353F",
    padding: 16,
    borderRadius: 16,
  },
  detailFooter: {
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  addButton: {
    backgroundColor: "#FF7668",
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 18,
  },
  addText: {
    color: "#24262F",
    fontWeight: "700",
    fontSize: 15,
  },
});
