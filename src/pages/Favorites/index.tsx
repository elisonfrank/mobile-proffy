import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import PageHeader from "../../components/PageHeader";
import TeacherItem, { Teacher } from "../../components/TeacherItem";
import AsyncStorage from "@react-native-community/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import styles from "./styles";

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState([]);

  function loadFavotires() {
    AsyncStorage.getItem("favorites").then((response) => {
      if (response) {
        const favoritedTeachers = JSON.parse(response);
        setFavorites(favoritedTeachers);
      }
    });
  }

  useFocusEffect(() => {
    // React.useCallback(() => {
    loadFavotires();
    // }, []);
  });

  return (
    <View style={styles.container}>
      <PageHeader title="Meus Proffys favoritos"></PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      >
        {favorites.map((item: Teacher) => {
          return <TeacherItem key={item.id} teacher={item} favorited />;
        })}
      </ScrollView>
    </View>
  );
};

export default Favorites;
