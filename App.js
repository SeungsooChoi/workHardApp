import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
import { theme } from "./colors";
import Loading from "./loading";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({}); // hashmap
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadToDos();
  }, []);

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    // toDos -> toString and save storage
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.log(error);
    }
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(s));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const addToDo = async () => {
    if (text === "") {
      return;
    }
    // save to do
    const newToDo = { ...toDos, [Date.now()]: { text, working } };
    setToDos(newToDo);
    await saveToDos(newToDo);
    setText("");
  };
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do?", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Ok",
        onPress: () => {
          const newToDo = { ...toDos };
          delete newToDo[key];
          setToDos(newToDo);
          saveToDos(newToDo);
        },
      },
    ]);
  };
  return loading ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        value={text}
        returnKeyType="done"
        placeholder={working ? "Add a To Do" : "Where do you wanna go?"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Fontisto name="trash" size={20} color={theme.grey} />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 44,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    fontSize: 20,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginVertical: 15,
  },
  toDo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.toDoBg,
    marginBottom: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  toDoText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
});
