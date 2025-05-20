import { Button, ScreenWrapper } from "@/components";
import { Section } from "@/components/global/Section";
import { setAllCategories } from "@/redux/categoriesSlice";
import { setAllCategoriesItems } from "@/redux/categoryItemsSlice";
import { selectRooms, setRoom } from "@/redux/roomsSlice";
import { setSupportingMaterial } from "@/redux/supportingMaterialSlice";
import { COLORS } from "@/utills/ThemeStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
const index: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const roomsHistory = useSelector(selectRooms);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await AsyncStorage.getItem("categories");
        const categoriesItems = await AsyncStorage.getItem("categoryItems");
        const supportingMaterials = await AsyncStorage.getItem(
          "supportingMaterials"
        );
        const roomHistory = await AsyncStorage.getItem("roomHistory");
        if (categories) {
          dispatch(setAllCategories(JSON.parse(categories)));
        }
        if (categoriesItems) {
          dispatch(setAllCategoriesItems(JSON.parse(categoriesItems)));
        }
        if (supportingMaterials) {
          dispatch(setSupportingMaterial(JSON.parse(supportingMaterials)));
        }
        if (roomHistory) {
          dispatch(setRoom(JSON.parse(roomHistory)));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);
  const isToday = (someDate: string) => {
    const today = new Date();
    const [month, day, year] = someDate.split(",")[0].split("/");
    const date = new Date(
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    );
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  const todayHistory =
    roomsHistory?.filter((item: any) => isToday(item.date)) || [];

  const dateHandler = (da: any) => {
    console.log(da);

    if (!da || typeof da !== "string") {
      return { date: "Invalid Date", time: "Invalid Time" };
    }

    // Attempt manual split for "M/D/YYYY, H:MM:SS AM/PM"
    const [datePart, timePart] = da.split(", ");
    if (!datePart || !timePart) {
      return { date: "Invalid Date", time: "Invalid Time" };
    }

    const [month, day, year] = datePart.split("/");
    const dateFormatted = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;
    const time12 = timePart;
    return { date: dateFormatted, time: time12 };
  };
  const groupedByDate: { [key: string]: any[] } = {};
  roomsHistory?.forEach((item: any) => {
    console.log(item);

    if (!isToday(item.date)) {
      const date = dateHandler(item?.date)?.date;
      if (!groupedByDate[date]) groupedByDate[date] = [];
      groupedByDate[date].push(item);
    }
  });
  return (
    <ScreenWrapper scroll edges={["left", "right"]}>
      <Button
        onPress={() => navigation.navigate("newMeasure" as never)}
        title="New Measurement"
      />
      <Section containerStyle={{ marginTop: 20 }} title="History">
        {todayHistory.length > 0 && (
          <Section containerStyle={styles.InnerSectionStyles} title="Today">
            {todayHistory.reverse().map((item: any, index: number) => (
              <Link
                key={`today-${index}`}
                href={{
                  pathname: "/home/newMeasure",
                  params: { item: JSON.stringify(item.rooms), date: item.date },
                }}
                asChild
              >
                <Pressable style={styles.row}>
                  <Text>{dateHandler(item.date).time}</Text>
                  <Text>
                    {item.rooms.length}{" "}
                    {item.rooms.length > 1 ? "Rooms" : "Room"}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={24}
                    color={COLORS().primary}
                  />
                </Pressable>
              </Link>
            ))}
          </Section>
        )}

        {Object.keys(groupedByDate).reverse().map((date) => (
          <Section
            key={date}
            containerStyle={[styles.InnerSectionStyles, { marginTop: 20 }]}
            title={date}
          >
            {groupedByDate[date].map((item: any, index: number) => (
              <Link
                key={`${date}-${index}`}
                href={{
                  pathname: "/home/newMeasure",
                  params: { item: JSON.stringify(item.rooms), date: item.date },
                }}
                asChild
              >
                <Pressable style={styles.row}>
                  <Text>{dateHandler(item.date).time}</Text>
                  <Text>
                    {item.rooms.length}{" "}
                    {item.rooms.length > 1 ? "Rooms" : "Room"}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={24}
                    color={COLORS().primary}
                  />
                </Pressable>
              </Link>
            ))}
          </Section>
        ))}
      </Section>
    </ScreenWrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS().surface,
    padding: 10,
    marginVertical: 3,
    borderRadius: 15,
  },
  link: {
    fontSize: 16,
  },
  InnerSectionStyles: {
    marginBottom: 10,
    backgroundColor: COLORS().background,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: "transparent",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
});
