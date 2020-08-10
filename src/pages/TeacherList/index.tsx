import React, { useState } from "react";
import { View, ScrollView, Text, TextInput } from "react-native";
import PageHeader from "../../components/PageHeader";
import TeacherItem, { Teacher } from "../../components/TeacherItem";
import { BorderlessButton, RectButton } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";

import styles from "./styles";
import api from "../../services/api";

function TeacherList() {
  const arrWeekDay = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];
  const [subject, setSubject] = useState("");
  const [week_day, setWeekDay] = useState("");
  const [time, setTime] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  function loadFavotires() {
    AsyncStorage.getItem("favorites").then((response) => {
      if (response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map(
          (teacher: Teacher) => {
            return teacher.id;
          }
        );

        setFavorites(favoritedTeachersIds);
      }
    });
  }

  function searchTeachers() {
    loadFavotires();

    const search = {
      week_day,
      subject,
      time,
    };

    api
      .get("classes", {
        params: search,
      })
      .then((response) => {
        setTeachers(response.data);
        setIsFiltersVisible(false);
      })
      .catch((error) => console.log("Erro ao buscar os proffys.", error));
  }

  return (
    <View style={styles.container}>
      <PageHeader
        title="Proffys disponíveis"
        headerRight={
          <BorderlessButton
            onPress={() => setIsFiltersVisible(!isFiltersVisible)}
          >
            <Feather name="filter" size={20} color="#FFF"></Feather>
          </BorderlessButton>
        }
      >
        {isFiltersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput
              style={styles.input}
              placeholder="Qual a matéria?"
              placeholderTextColor="#C1BCCC"
              value={subject}
              onChangeText={(text) => setSubject(text)}
            />

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia a semana</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Qual o dia?"
                  placeholderTextColor="#C1BCCC"
                  value={arrWeekDay[Number(week_day)]}
                  onChangeText={(text) =>
                    setWeekDay(
                      arrWeekDay.indexOf(text.toLowerCase()).toString()
                    )
                  }
                />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Hora</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Qual a hora?"
                  placeholderTextColor="#C1BCCC"
                  value={time}
                  onChangeText={(text) => setTime(text)}
                />
              </View>
            </View>

            <RectButton style={styles.submitButton} onPress={searchTeachers}>
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>
      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      >
        {teachers.map((item: Teacher) => {
          return (
            <TeacherItem
              key={item.id}
              teacher={item}
              favorited={favorites.includes(item.id)}
            ></TeacherItem>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default TeacherList;
