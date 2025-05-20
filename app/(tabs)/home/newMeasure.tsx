import {
  Button,
  CustomIconButton,
  CustomInput,
  ScreenWrapper,
  SelectInput,
} from "@/components";
import { Section } from "@/components/global/Section";
import { selectCategoryItems } from "@/redux/categoryItemsSlice";
import { selectRooms, setRoom } from "@/redux/roomsSlice";
import { selectSupportingMaterial } from "@/redux/supportingMaterialSlice";
import { COLORS } from "@/utills/ThemeStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
const NewMeasure: React.FC = () => {
  type Option = {
    label: string;
    value: string;
    price: number;
    width: number;
    height: number;
    quantity?: number | string; // Allow both number and string
  };
  const params = useLocalSearchParams();

  const roomdata =
    typeof params?.item === "string" ? JSON.parse(params.item) : null;
  const roomDate = params.date;

  const navigation = useNavigation();
  const categoryItems = useSelector(selectCategoryItems);
  const roomsHistory = useSelector(selectRooms);
  const dispatch = useDispatch();
  const supportingMaterials = useSelector(selectSupportingMaterial);
  const [isRoomEditing, setIsRoomEditing] = useState(false);
  const [roomEditingID, setRoomEditingID] = useState("");
  const [rooms, setRooms] = useState<
    {
      id: string;
      penalingItems: {
        PVCWallSheets: {
          singleSheetPrice: number;
          PenalingType: string;
          totalWallSheets: number;
          totalWallSheetPrice: number;
          labourRate: number;
        };
        PVCGolas: {
          totalGolas: number;
          totalGolasPrice: number;
          singleGolaPrice: number;
        };
      };
      ceilingItems: {
        CeilingTiles: {
          singleCeilingTilePrice: number;
          CeilingType: string;
          ceilingSheets: number;
          totalCeilingTilesPrice: number;
          ceilingWithLabour: string;
          ceilingWithoutLabour: string;
        };
        LongTs: {
          totalMainT12ft: number;
          totalLongT12ftPrice: number;
        };
        smallTs: {
          totalCrossT2ft: number;
          totalCrossT2ftPrice: number;
        };
        Ls: {
          totalL10ft: number;
          totalL10ftPrice: number;
        };
        perFootTRate: string;
        SingleLRate: string;
      };
      additionalItems: {
        name: string;
        quantity: number;
        Totalprice: number;
      }[];
      dimentions: {
        walls: any;
        avgWidth: number;
        avgLength: number;
        penaling: {
          orignalDimentions: {
            windows: any;
            doors: any;
          };
          totalWallFeet: number;
          windowAreaFeet: number;
          doorsAreaFeet: number;
        };
        ceiling: {
          ceilingAreaFeet: number;
        };
      };
      TotalCosts: {
        penaling: number;
        Ceiling: number;
        additionalCosts: number;
        penalingLabourRate: number;
        CompleteCeilingRateWithoutLabour: number;
        CompleteCeilingRateWithLabour: number;
        ceilingLabourRate: number;
      };
    }[]
  >(roomdata || []);
  const [isNewRoomPressed, setIsNewRoomPressed] = useState(false);
  const [isCeilingEnabled, setIsCeilingEnabled] = useState(false);
  const [isPanelingEnabled, setIsPanelingEnabled] = useState(false);
  const [PVCPanelingLabourRate, setPVCPanelingLabourRate] = useState<string>();
  const [CeilingRateWithLabour, setCeilingRateWithLabour] = useState<string>();
  const [CeilingRateWithoutLabour, setCeilingRateWithoutLabour] =
    useState<string>();

  const [isAdditionalMaterialEnabled, setIsAdditionalMaterialEnabled] =
    useState(false);
  const [walls, setWalls] = useState<string[]>([]);
  const [windows, setWindows] = useState([{ height: "", width: "" }]);
  const [doors, setDoors] = useState([{ height: "", width: "" }]);
  const [GolaRate, setGolaRate] = useState(
    supportingMaterials.find((item) => item.name.includes("Gola"))
  );

  const [TRate, setTRate] = useState(
    supportingMaterials.find((item) => item.name.includes("T"))
  );
  const [LRate, setLRate] = useState(
    supportingMaterials.find((item) => item.name.includes("L"))
  );
  const [selectedWallSheetType, setSelectedWallSheetType] = useState<Option[]>(
    []
  );

  const [selectedCeilingType, setSelectedCeilingType] = useState<Option[]>([]);
  const [additionalItems, setAdditionalItems] = useState<Option[]>([]);

  const handleWallChange = (text: string, index: number) => {
    const updatedWalls = [...walls];
    updatedWalls[index] = text;
    setWalls(updatedWalls);
  };

  const handleAddWindow = () =>
    setWindows([...windows, { height: "", width: "" }]);

  const handleWindowChange = (
    index: number,
    field: keyof (typeof windows)[number],
    value: string
  ) => {
    const updated = [...windows];
    updated[index][field] = value;
    setWindows(updated);
  };

  const handleAddDoor = () => setDoors([...doors, { height: "", width: "" }]);

  const handleDoorChange = (
    index: number,
    field: keyof (typeof doors)[number],
    value: string
  ) => {
    const updated = [...doors];
    updated[index][field] = value;
    setDoors(updated);
  };

  const handleSaveData = async () => {
    try {
      console.log(roomDate, "aaaaaaa");

      if (roomDate != null) {
        const newData = roomsHistory.map((item: any) =>
          item.date == roomDate ? { rooms, date: roomDate } : item
        );
        dispatch(setRoom(newData));
      } else {
        console.log("sssssssssssss in null");
        dispatch(
          setRoom([
            ...roomsHistory,
            { rooms, date: new Date().toLocaleString() },
          ])
        );
        await AsyncStorage.setItem(
          "roomHistory",
          JSON.stringify([
            ...roomsHistory,
            { rooms, date: new Date().toLocaleString() },
          ])
        );
      }
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };
  const handleSave = () => {
    const emptyWallIndex = walls.findIndex((wall) => wall.trim() === "");
    if (emptyWallIndex !== -1) {
      Alert.alert(
        "Incomplete Wall Dimensions",
        `Please provide a value for Wall ${emptyWallIndex + 1}.`
      );
      return;
    }
    if (walls.length === 0) {
      Alert.alert(
        "Error",
        "Room dimensions are required to add Paneling or Ceiling."
      );
      return;
    }

    if (isCeilingEnabled && walls.length < 4) {
      Alert.alert("Error", "At least 4 walls are required to add Ceiling.");
      return;
    }

    const GOLA_LENGTH = GolaRate?.length || 0; // Default to 0 if not found
    let windowAreaFeet = 0;
    let doorsAreaFeet = 0;
    let totalWallFeet = 0;
    let totalGolas = 0;
    let totalWallSheets = 0;

    if (isPanelingEnabled) {
      windowAreaFeet = windows.reduce(
        (acc, w) =>
          acc + (parseFloat(w.height) || 0) * (parseFloat(w.width) || 0),
        0
      );
      doorsAreaFeet = doors.reduce(
        (acc, d) =>
          acc + (parseFloat(d.height) || 0) * (parseFloat(d.width) || 0),
        0
      );
      totalWallFeet = walls.reduce((acc, w) => acc + parseFloat(w), 0) * 12;
      totalGolas =
        walls.reduce(
          (acc, wall) => acc + Math.ceil((parseFloat(wall) || 0) / GOLA_LENGTH),
          0
        ) *
          2 +
        walls.length +
        windowAreaFeet / GOLA_LENGTH +
        doorsAreaFeet / GOLA_LENGTH;
      totalWallSheets = Math.ceil(
        totalWallFeet / selectedWallSheetType[0]?.width -
          windowAreaFeet / selectedWallSheetType[0]?.width -
          doorsAreaFeet / selectedWallSheetType[0]?.width
      );
    }

    let ceilingSheets = 0;
    let totalMainT12ft = 0;
    let totalCrossT2ft = 0;
    let totalL10ft = 0;
    let avgWidth = 0;
    let avgLength = 0;
    let ceilingAreaFeet = 0;
    if (walls.length == 4) {
      const sortedWalls = [...walls.map(Number)].sort((a, b) => a - b);
      avgWidth = (sortedWalls[0] + sortedWalls[1]) / 2;
      avgLength = (sortedWalls[2] + sortedWalls[3]) / 2;
    }
    if (isCeilingEnabled) {
      const tileWidth = selectedCeilingType[0]?.width / 12; // Convert inches to feet
      const tileLength = selectedCeilingType[0]?.height / 12; // Convert inches to feet

      const tilesInRow = Math.ceil(avgWidth / tileWidth);
      const tilesInColumn = Math.ceil(avgLength / tileLength);

      ceilingAreaFeet = avgLength * avgWidth;
      const ceilingSheetDimentionInFeet =
        (selectedCeilingType[0]?.width + selectedCeilingType[0]?.height) / 12;
      ceilingSheets = Math.ceil(ceilingAreaFeet / ceilingSheetDimentionInFeet);

      // Main T
      const numberOfMainTs = Math.ceil(avgWidth / 2);
      const totalLengthMainT = avgLength * numberOfMainTs;
      totalMainT12ft = Math.ceil(totalLengthMainT / 12) - 1;

      // Calculate Small Ts
      const totalSmallTsinRow = tilesInRow - 1;
      totalCrossT2ft = totalSmallTsinRow * tilesInColumn;

      // L-Angle
      const totalPerimeter = 2 * (avgLength + avgWidth);
      totalL10ft = Math.ceil(totalPerimeter / (LRate?.length || 0));
    }

    const newRoom: any = {};

    // Add Paneling Items if enabled
    if (isPanelingEnabled && selectedWallSheetType.length > 0) {
      newRoom.penalingItems = {
        PVCWallSheets: {
          singleSheetPrice: selectedWallSheetType[0]?.price,
          PenalingType: selectedWallSheetType[0]?.label,
          totalWallSheets,
          totalWallSheetPrice:
            selectedWallSheetType[0].price * (totalWallSheets ?? 0),
          labourRate: PVCPanelingLabourRate,
        },
        PVCGolas: {
          totalGolas: Math.ceil(totalGolas ?? 0),
          totalGolasPrice: Math.ceil(totalGolas ?? 0) * (GolaRate?.price || 0),
          singleGolaPrice: GolaRate,
        },
      };
    }

    // Add Ceiling Items if enabled
    if (isCeilingEnabled && selectedCeilingType.length > 0) {
      newRoom.ceilingItems = {
        CeilingTiles: {
          singleCeilingTilePrice: selectedCeilingType[0]?.price,
          CeilingType: selectedCeilingType[0]?.label,
          ceilingSheets,
          totalCeilingTilesPrice: ceilingSheets * selectedCeilingType[0]?.price,
          ceilingWithLabour: CeilingRateWithLabour,
          ceilingWithoutLabour: CeilingRateWithoutLabour,
        },
        LongTs: {
          totalMainT12ft,
          totalLongT12ftPrice: (TRate?.price ?? 0) * 12 * totalMainT12ft,
        },
        smallTs: {
          totalCrossT2ft,
          totalCrossT2ftPrice: (TRate?.price ?? 0) * 2 * totalCrossT2ft,
        },
        Ls: {
          totalL10ft,
          totalL10ftPrice: (LRate?.price ?? 0) * totalL10ft,
        },
        perFootTRate: TRate,
        SingleLRate: LRate,
      };
    }

    // Add Dimensions if calculated
    if (avgWidth && avgLength) {
      newRoom.dimentions = {
        walls: walls,
        avgWidth: avgWidth || null,
        avgLength: avgLength || null,
        penaling: {
          orignalDimentions: {
            windows: windows,
            doors: doors,
          },
          totalWallFeet: totalWallFeet || 0,
          windowAreaFeet: windowAreaFeet || 0,
          doorsAreaFeet: doorsAreaFeet || 0,
        },
        ceiling: {
          ceilingAreaFeet: ceilingAreaFeet || 0,
        },
      };
    }

    // Add Additional Items if any
    if (additionalItems?.length > 0) {
      newRoom.additionalItems = additionalItems.map((item) => ({
        name: item.label,
        quantity: item.quantity || 0,
        Totalprice: Math.ceil(item.price * (Number(item.quantity) ?? 0)),
      }));
    }

    // Add Total Costs
    newRoom.TotalCosts = {};

    const penaling = isPanelingEnabled
      ? (selectedWallSheetType[0]?.price || 0) * (totalWallSheets || 0) +
        Math.ceil(totalGolas || 0) * (GolaRate?.price || 0)
      : 0;
    if (penaling) newRoom.TotalCosts.penaling = penaling;

    const ceiling = isCeilingEnabled
      ? (ceilingSheets || 0) * (selectedCeilingType[0]?.price || 0) +
        (TRate?.price || 0) * 12 * (totalMainT12ft || 0) +
        (TRate?.price || 0) * 2 * (totalCrossT2ft || 0) +
        (LRate?.price || 0) * (totalL10ft || 0)
      : 0;
    if (ceiling) newRoom.TotalCosts.Ceiling = ceiling;

    const additionalCosts = Array.isArray(additionalItems)
      ? additionalItems.reduce((acc, cur) => {
          const itemTotal = (cur.price || 0) * (Number(cur.quantity) || 0);
          return acc + (isNaN(itemTotal) ? 0 : itemTotal);
        }, 0)
      : 0;
    if (additionalCosts) newRoom.TotalCosts.additionalCosts = additionalCosts;

    const penalingLabourRate =
      (parseFloat(PVCPanelingLabourRate || "0") || 0) * (totalWallSheets || 0);
    if (!isNaN(penalingLabourRate) && penalingLabourRate !== 0)
      newRoom.TotalCosts.penalingLabourRate = penalingLabourRate;

    const ceilingRateWithoutLabour =
      Number(CeilingRateWithoutLabour) * ceilingAreaFeet;
    if (!isNaN(ceilingRateWithoutLabour) && ceilingRateWithoutLabour !== 0)
      newRoom.TotalCosts.CompleteCeilingRateWithoutLabour =
        ceilingRateWithoutLabour;

    const ceilingRateWithLabour =
      Number(CeilingRateWithLabour) * ceilingAreaFeet;
    if (!isNaN(ceilingRateWithLabour) && ceilingRateWithLabour !== 0)
      newRoom.TotalCosts.CompleteCeilingRateWithLabour = ceilingRateWithLabour;

    const ceilingLabourRate =
      (Number(CeilingRateWithLabour) - Number(CeilingRateWithoutLabour)) *
      ceilingAreaFeet;
    if (!isNaN(ceilingLabourRate) && ceilingLabourRate !== 0)
      newRoom.TotalCosts.ceilingLabourRate = ceilingLabourRate;
    newRoom.id = Date.now();
    console.log(newRoom);
    if (isRoomEditing) {
      setRooms(
        rooms.map((room) =>
          room.id === roomEditingID ? { ...room, ...newRoom } : room
        )
      );
    } else {
      setRooms([...rooms, newRoom]);
    }
    setIsNewRoomPressed(false);
    setAdditionalItems([]);
    setWindows([{ height: "", width: "" }]);
    setDoors([{ height: "", width: "" }]);
    setWalls([""]);
    setSelectedWallSheetType([]);
    setSelectedCeilingType([]);
    setGolaRate(supportingMaterials.find((item) => item.name.includes("Gola")));
    setTRate(supportingMaterials.find((item) => item.name.includes("T")));
    setLRate(supportingMaterials.find((item) => item.name.includes("L")));
    setPVCPanelingLabourRate("");
    setCeilingRateWithLabour("");
    setCeilingRateWithoutLabour("");
    setIsCeilingEnabled(false);
    setIsPanelingEnabled(false);
    setIsRoomEditing(false);
    setRoomEditingID("");
  };
  const handleCancel = () => {
    setIsNewRoomPressed(false);
    setAdditionalItems([]);
    setWindows([{ height: "", width: "" }]);
    setDoors([{ height: "", width: "" }]);
    setWalls([""]);
    setSelectedWallSheetType([]);
    setSelectedCeilingType([]);
    setGolaRate(supportingMaterials.find((item) => item.name.includes("Gola")));
    setTRate(supportingMaterials.find((item) => item.name.includes("T")));
    setLRate(supportingMaterials.find((item) => item.name.includes("L")));
    setPVCPanelingLabourRate("");
    setCeilingRateWithLabour("");
    setCeilingRateWithoutLabour("");
    setIsCeilingEnabled(false);
    setIsPanelingEnabled(false);
    setIsRoomEditing(false);
    setRoomEditingID("");
  };
  // console.log(rooms[0].TotalCosts);

  const handleRoomDelete = (id: string) => {
    const newRooms = rooms.filter((room) => room.id != id);
    setRooms(newRooms);
  };
  const handleRoomEdit = (room: any) => {
    setIsRoomEditing(true);
    setRoomEditingID(room?.id);
    if (room?.penalingItems?.PVCWallSheets?.PenalingType) {
      setIsPanelingEnabled(true);
      const wallSheetType = categoryItems
        .filter((item) => item.categoryName == "Penaling") // Filter items by categoryName
        .map((item) => ({
          label: item?.name,
          value: item?.name,
          price: item?.price,
          width: item?.width,
          height: item?.height,
        }))
        .filter(
          (item) =>
            item.label == room?.penalingItems?.PVCWallSheets?.PenalingType
        );
      setSelectedWallSheetType(wallSheetType);
      setDoors(room?.dimentions?.penaling?.orignalDimentions?.windows);
      setWindows(room?.dimentions?.penaling?.orignalDimentions?.doors);
      setGolaRate(room?.penalingItems?.PVCGolas?.singleGolaPrice);
      setPVCPanelingLabourRate(room?.penalingItems?.PVCWallSheets?.labourRate);
    }
    if (room?.ceilingItems?.CeilingTiles?.CeilingType) {
      setIsCeilingEnabled(true);
      const ceilingType = categoryItems
        .filter((item) => item.categoryName.trim().toLowerCase() === "ceiling")
        .map((item) => ({
          label: item?.name,
          value: item?.name,
          price: item?.price,
          width: item?.width,
          height: item?.height,
        }))
        .filter(
          (item) => item.label == room?.ceilingItems?.CeilingTiles?.CeilingType
        );
      setSelectedCeilingType(ceilingType);
      setTRate(room?.ceilingItems?.perFootTRate);
      setLRate(room?.ceilingItems?.SingleLRate);
      setCeilingRateWithLabour(
        room?.ceilingItems?.CeilingTiles?.ceilingWithLabour
      );
      setCeilingRateWithoutLabour(
        room?.ceilingItems?.CeilingTiles?.ceilingWithoutLabour
      );
    }
    if (room?.additionalItems?.length > 0) {
      const mappedAdditionalItems =
        room?.additionalItems.length > 0 &&
        room?.additionalItems?.map((item: any) => ({
          label: item?.name, // Map `name` to `label`
          value: item?.name, // Use `name` as the `value`
          price: item?.Totalprice / (Number(item.quantity) || 1), // Calculate price per unit
          quantity: item?.quantity, // Keep quantity as is
        }));
      setAdditionalItems(mappedAdditionalItems);
    }
    if (room?.dimentions?.walls?.length > 0) {
      setWalls(room?.dimentions?.walls);
    }
    setIsNewRoomPressed(true);
  };
  const handleRemoveItem = (items: any[], type: string) => {
    const updatedItems = [...items]; // Create a copy of the array
    updatedItems.pop(); // Remove the last element
    if (type == "doors") {
      setDoors(updatedItems); // Update the state with the modified array
    }
    if (type == "windows") {
      setWindows(updatedItems); // Update the state with the modified array
    }
    if (type == "additional") {
      setAdditionalItems(updatedItems); // Update the state with the modified array
    }
    if (type == "dimentions") {
      setWalls(updatedItems); // Update the state with the modified array
    }
  };
  return (
    <ScreenWrapper edges={["left", "right"]}>
      {!isNewRoomPressed && (
        <View style={[styles.row, { paddingBottom: 15 }]}>
          {!isNewRoomPressed && (
            <Button
              buttonStyle={{ flex: 1 }}
              title="Add New Room"
              onPress={() => setIsNewRoomPressed(true)}
            />
          )}
          {rooms.length > 0 && !isNewRoomPressed && (
            <Button
              buttonStyle={{
                flex: 1,
                backgroundColor: COLORS().secondaryDisabled,
              }}
              title="Save All Data"
              onPress={handleSaveData}
            />
          )}
        </View>
      )}
      {isNewRoomPressed && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          {/* Room Dimensions */}
          <Section title="Room Dimensions">
            {walls.map((value, index) => (
              <CustomInput
                keyboardType="numeric"
                key={index}
                placeholder={`Wall ${index + 1} Width (ft)`}
                value={value}
                onChangeText={(text) => handleWallChange(text, index)}
              />
            ))}
            <View style={styles.saveCancelRow}>
              <CustomIconButton
                icon={
                  <AntDesign
                    name="pluscircleo"
                    size={24}
                    color={COLORS().primary}
                  />
                }
                onPress={() => setWalls([...walls, ""])}
                style={{ flex: 1 }}
              />
              <CustomIconButton
                icon={
                  <AntDesign
                    name="minuscircleo"
                    size={24}
                    color={COLORS().error}
                  />
                }
                onPress={() => handleRemoveItem(walls, "dimentions")}
                style={{ flex: 1, borderColor: COLORS().error }}
              />
            </View>
          </Section>

          {/* Penaling */}
          <Section
            title="Penaling"
            showSwitch
            isSwitchOn={isPanelingEnabled}
            onChange={() => setIsPanelingEnabled(!isPanelingEnabled)}
          >
            <SelectInput
              placeholder="Select Sheet Type"
              options={categoryItems
                .filter((item) => item.categoryName == "Penaling") // Filter items by categoryName
                .map((item) => ({
                  label: item?.name,
                  value: item?.name,
                  price: item?.price,
                  width: item?.width,
                  height: item?.height,
                }))}
              selectedValues={selectedWallSheetType}
              onSelect={(selected) => setSelectedWallSheetType(selected)}
              style={{ opacity: isPanelingEnabled ? 1 : 0.5 }}
              disabled={!isPanelingEnabled}
            />
            {selectedWallSheetType?.length > 0 && isPanelingEnabled && (
              <>
                <View style={styles.titleInputWrapper}>
                  <Text style={styles.titleInput}>
                    PVC Paneling Labour Rate
                  </Text>
                  <CustomInput
                    keyboardType="numeric"
                    value={PVCPanelingLabourRate}
                    onChangeText={setPVCPanelingLabourRate}
                    placeholder="Paneling Labour Rate"
                  />
                </View>
                <View style={styles.titleInputWrapper}>
                  <Text style={styles.titleInput}>PVC Paneling Rate</Text>
                  <CustomInput
                    keyboardType="numeric"
                    value={selectedWallSheetType[0].price.toString()}
                    onChangeText={(value) =>
                      setSelectedWallSheetType([
                        {
                          ...selectedWallSheetType[0],
                          price: Number(value),
                        },
                      ])
                    }
                    placeholder="Enter Custom PVC Rate"
                  />
                </View>
                <View style={styles.titleInputWrapper}>
                  <Text style={styles.titleInput}>PVC Gola Rate</Text>
                  <CustomInput
                    keyboardType="numeric"
                    value={GolaRate?.price.toString()}
                    onChangeText={(value) =>
                      setGolaRate({
                        ...GolaRate,
                        price: Number(value),
                        id: GolaRate?.id || "",
                        name: GolaRate?.name || "Default Name",
                      })
                    }
                    placeholder="Enter Custom Gola Rate"
                  />
                </View>
              </>
            )}
          </Section>
          {selectedWallSheetType?.length > 0 && (
            <>
              {/* Windows */}
              <Section title="Windows">
                {windows.map((window, index) => (
                  <View key={index} style={styles.row}>
                    <CustomInput
                      keyboardType="numeric"
                      placeholder="Height (ft)"
                      value={window?.height}
                      onChangeText={(text) =>
                        handleWindowChange(index, "height", text)
                      }
                      containerStyle={{ flex: 1 }}
                    />
                    <CustomInput
                      keyboardType="numeric"
                      placeholder="Width (ft)"
                      value={window.width}
                      onChangeText={(text) =>
                        handleWindowChange(index, "width", text)
                      }
                      containerStyle={{ flex: 1 }}
                    />
                  </View>
                ))}
                <View style={styles.saveCancelRow}>
                  <CustomIconButton
                    icon={
                      <AntDesign
                        name="pluscircleo"
                        size={24}
                        color={COLORS().primary}
                      />
                    }
                    onPress={handleAddWindow}
                    style={{ flex: 1 }}
                  />
                  <CustomIconButton
                    icon={
                      <AntDesign
                        name="minuscircleo"
                        size={24}
                        color={COLORS().error}
                      />
                    }
                    onPress={() => handleRemoveItem(windows, "windows")}
                    style={{ flex: 1, borderColor: COLORS().error }}
                  />
                </View>
              </Section>

              {/* Doors */}
              <Section title="Doors">
                {doors.map((door, index) => (
                  <View key={index} style={styles.row}>
                    <CustomInput
                      keyboardType="numeric"
                      placeholder="Height (ft)"
                      value={door?.height}
                      onChangeText={(text) =>
                        handleDoorChange(index, "height", text)
                      }
                      containerStyle={{ flex: 1 }}
                    />
                    <CustomInput
                      keyboardType="numeric"
                      placeholder="Width (ft)"
                      value={door.width}
                      onChangeText={(text) =>
                        handleDoorChange(index, "width", text)
                      }
                      containerStyle={{ flex: 1 }}
                    />
                  </View>
                ))}
                <View style={styles.saveCancelRow}>
                  <CustomIconButton
                    icon={
                      <AntDesign
                        name="pluscircleo"
                        size={24}
                        color={COLORS().primary}
                      />
                    }
                    onPress={handleAddDoor}
                    style={{ flex: 1 }}
                  />
                  <CustomIconButton
                    icon={
                      <AntDesign
                        name="minuscircleo"
                        size={24}
                        color={COLORS().error}
                      />
                    }
                    onPress={() => handleRemoveItem(doors, "doors")}
                    style={{ flex: 1, borderColor: COLORS().error }}
                  />
                </View>
              </Section>
            </>
          )}

          {/* Ceiling */}
          <Section
            title="Ceiling"
            showSwitch
            isSwitchOn={isCeilingEnabled}
            onChange={() => setIsCeilingEnabled(!isCeilingEnabled)}
          >
            <SelectInput
              placeholder="Select Ceiling Type"
              options={categoryItems
                .filter(
                  (item) => item.categoryName.trim().toLowerCase() === "ceiling"
                )
                .map((item) => ({
                  label: item?.name,
                  value: item?.name,
                  price: item?.price,
                  width: item?.width,
                  height: item?.height,
                }))}
              selectedValues={selectedCeilingType}
              onSelect={(selected) => setSelectedCeilingType(selected)}
              style={{ opacity: isCeilingEnabled ? 1 : 0.5 }}
              disabled={!isCeilingEnabled}
            />
            {selectedCeilingType?.length > 0 && isCeilingEnabled && (
              <>
                <View style={styles.titleInputWrapper}>
                  <Text style={styles.titleInput}>
                    Ceiling Rate with Labour (per ft)
                  </Text>
                  <CustomInput
                    keyboardType="numeric"
                    value={CeilingRateWithLabour}
                    onChangeText={setCeilingRateWithLabour}
                    placeholder="Ceiling Rate with Labour"
                  />
                </View>
                <View style={styles.titleInputWrapper}>
                  <Text style={styles.titleInput}>
                    Ceiling Rate without Labour (per ft)
                  </Text>
                  <CustomInput
                    keyboardType="numeric"
                    value={CeilingRateWithoutLabour}
                    onChangeText={setCeilingRateWithoutLabour}
                    placeholder="Ceiling Rate without Labour"
                  />
                </View>
                <View style={styles.titleInputWrapper}>
                  <Text style={styles.titleInput}>Ceiling Rate</Text>
                  <CustomInput
                    keyboardType="numeric"
                    value={selectedCeilingType[0].price.toString()}
                    onChangeText={(value) =>
                      setSelectedCeilingType([
                        { ...selectedCeilingType[0], price: Number(value) },
                      ])
                    }
                    placeholder="Enter Custom Ceiling Rate"
                  />
                </View>
                <View style={styles.titleInputWrapper}>
                  <Text style={styles.titleInput}>T Rate</Text>
                  <CustomInput
                    keyboardType="numeric"
                    value={TRate?.price.toString()}
                    onChangeText={(value) =>
                      setTRate({
                        ...TRate,
                        price: Number(value),
                        id: TRate?.id || "",
                        name: TRate?.name || "Default Name",
                      })
                    }
                    placeholder="Enter Custom T Rate"
                  />
                </View>
                <View style={styles.titleInputWrapper}>
                  <Text style={styles.titleInput}>L Rate</Text>
                  <CustomInput
                    keyboardType="numeric"
                    value={LRate?.price.toString()}
                    onChangeText={(value) =>
                      setTRate({
                        ...LRate,
                        price: Number(value),
                        id: LRate?.id || "",
                        name: LRate?.name || "Default Name",
                      })
                    }
                    placeholder="Enter Custom L Rate"
                  />
                </View>
              </>
            )}
          </Section>
          <Section
            title="Additional Material"
            showSwitch
            isSwitchOn={isAdditionalMaterialEnabled}
            onChange={() =>
              setIsAdditionalMaterialEnabled(!isAdditionalMaterialEnabled)
            }
          >
            {additionalItems.map((item, index) => (
              <View key={index} style={styles.row}>
                <SelectInput
                  disabled={!isAdditionalMaterialEnabled}
                  style={{
                    flex: 1,
                    width: 200,
                    opacity: isCeilingEnabled ? 1 : 0.5,
                  }}
                  placeholder="Select Material"
                  options={categoryItems
                    .filter(
                      (item) =>
                        item.categoryName.trim().toLowerCase() === "others"
                    )
                    .map((item) => ({
                      label: item?.name,
                      value: item?.name,
                      price: item?.price,
                      width: item?.width,
                      height: item?.height,
                    }))}
                  selectedValues={[item]} // Pre-select the current item
                  onSelect={(selected) => {
                    const updatedItems = [...additionalItems];
                    updatedItems[index] = {
                      ...updatedItems[index],
                      ...selected[0],
                    };
                    setAdditionalItems(updatedItems);
                  }}
                />
                {/* Input for quantity */}
                <CustomInput
                  disabled={isAdditionalMaterialEnabled}
                  keyboardType="decimal-pad"
                  placeholder="Enter Quantity"
                  value={item.quantity?.toString() || ""}
                  onChangeText={(text) => {
                    const updatedItems = [...additionalItems];
                    updatedItems[index] = {
                      ...updatedItems[index],
                      quantity: text, // Keep the input as a string while typing
                    };
                    setAdditionalItems(updatedItems);
                  }}
                  onBlur={() => {
                    const updatedItems = [...additionalItems];
                    updatedItems[index] = {
                      ...updatedItems[index],
                      quantity: updatedItems[index]?.quantity || 0, // Convert to number on blur
                    };
                    setAdditionalItems(updatedItems);
                  }}
                  containerStyle={{ flex: 1 }}
                />
              </View>
            ))}
            {/* Button to add a new material */}
            {isAdditionalMaterialEnabled && (
              <View style={styles.saveCancelRow}>
                <CustomIconButton
                  style={{
                    opacity: isAdditionalMaterialEnabled ? 1 : 0.5,
                    flex: 1,
                  }}
                  disabled={!isAdditionalMaterialEnabled}
                  icon={
                    <AntDesign
                      name="pluscircleo"
                      size={24}
                      color={COLORS().primary}
                    />
                  }
                  onPress={() =>
                    setAdditionalItems([
                      ...additionalItems,
                      {
                        label: "",
                        value: "",
                        price: 0,
                        width: 0,
                        height: 0,
                        quantity: 0,
                      },
                    ])
                  }
                />
                <CustomIconButton
                  icon={
                    <AntDesign
                      name="minuscircleo"
                      size={24}
                      color={COLORS().error}
                    />
                  }
                  onPress={() =>
                    handleRemoveItem(additionalItems, "additional")
                  }
                  style={{ flex: 1, borderColor: COLORS().error }}
                />
              </View>
            )}
          </Section>
          {/* Save / Cancel Buttons */}
          <View style={styles.saveCancelRow}>
            <Button
              title="Save"
              onPress={handleSave}
              buttonStyle={styles.saveBtn}
            />
            <Button
              title="Cancel"
              onPress={handleCancel}
              buttonStyle={styles.cancelBtn}
            />
          </View>
        </ScrollView>
      )}
      {rooms?.length > 0 && !isNewRoomPressed && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {rooms.map((room, index) => {
            return (
              <Section key={index} title={`Room ${index + 1}`}>
                <View style={{ marginBottom: 10 }}>
                  {/* Dimensions Section */}
                  {room.dimentions && (
                    <Section
                      title="Dimensions"
                      containerStyle={styles.InnerSectionStyles}
                    >
                      {room.dimentions.avgWidth != null &&
                        room.dimentions.avgLength != null && (
                          <>
                            <View style={styles.row}>
                              <Text style={styles.keyText}>Average Width:</Text>
                              <Text style={styles.valueText}>
                                {room.dimentions.avgWidth} ft
                              </Text>
                            </View>
                            <View style={styles.row}>
                              <Text style={styles.keyText}>
                                Average Length:
                              </Text>
                              <Text style={styles.valueText}>
                                {room.dimentions.avgLength} ft
                              </Text>
                            </View>
                          </>
                        )}
                      {room.dimentions.penaling?.totalWallFeet > 0 && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>Total Wall Feet:</Text>
                          <Text style={styles.valueText}>
                            {room.dimentions.penaling.totalWallFeet} ft
                          </Text>
                        </View>
                      )}
                      {room.dimentions.penaling?.windowAreaFeet > 0 && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>Window Area:</Text>
                          <Text style={styles.valueText}>
                            {room.dimentions.penaling.windowAreaFeet} sq ft
                          </Text>
                        </View>
                      )}
                      {room.dimentions.penaling?.doorsAreaFeet > 0 && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>Door Area:</Text>
                          <Text style={styles.valueText}>
                            {room.dimentions.penaling.doorsAreaFeet} sq ft
                          </Text>
                        </View>
                      )}
                      {room.dimentions.ceiling?.ceilingAreaFeet > 0 && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>Ceiling Area:</Text>
                          <Text style={styles.valueText}>
                            {room.dimentions.ceiling.ceilingAreaFeet} sq ft
                          </Text>
                        </View>
                      )}
                    </Section>
                  )}

                  {/* Paneling Section */}
                  {room.penalingItems && (
                    <Section
                      title="Paneling"
                      containerStyle={styles.InnerSectionStyles}
                    >
                      {room.penalingItems.PVCWallSheets?.PenalingType && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>Wall Sheet Type:</Text>
                          <Text style={styles.valueText}>
                            {room.penalingItems.PVCWallSheets.PenalingType}
                          </Text>
                        </View>
                      )}
                      {room.penalingItems.PVCWallSheets?.totalWallSheets >
                        0 && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>Wall Sheets:</Text>
                          <Text style={styles.valueText}>
                            {room.penalingItems.PVCWallSheets.totalWallSheets}{" "}
                            sheets
                          </Text>
                        </View>
                      )}
                      {room.penalingItems.PVCGolas?.totalGolas > 0 && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>Golas:</Text>
                          <Text style={styles.valueText}>
                            {room.penalingItems.PVCGolas.totalGolas}
                          </Text>
                        </View>
                      )}
                      {room.penalingItems.PVCWallSheets?.totalWallSheetPrice >
                        0 && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>
                            Total Wall Sheet Price:
                          </Text>
                          <Text style={styles.valueText}>
                            RS.{" "}
                            {
                              room.penalingItems.PVCWallSheets
                                .totalWallSheetPrice
                            }
                          </Text>
                        </View>
                      )}
                      {room.penalingItems.PVCGolas?.totalGolasPrice > 0 && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>Total Gola Price:</Text>
                          <Text style={styles.valueText}>
                            RS. {room.penalingItems.PVCGolas.totalGolasPrice}
                          </Text>
                        </View>
                      )}
                      {room?.TotalCosts?.penaling &&
                        room?.TotalCosts?.penaling > 0 && (
                          <View style={styles.row}>
                            <Text style={styles.keyText}>Total:</Text>
                            <Text style={styles.valueText}>
                              Rs.{room.TotalCosts.penaling}
                            </Text>
                          </View>
                        )}
                    </Section>
                  )}

                  {/* Ceiling Section */}
                  {room.ceilingItems && (
                    <Section
                      title="Ceiling"
                      containerStyle={styles.InnerSectionStyles}
                    >
                      {room.ceilingItems.CeilingTiles?.CeilingType && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>Ceiling Type:</Text>
                          <Text style={styles.valueText}>
                            {room.ceilingItems.CeilingTiles.CeilingType}
                          </Text>
                        </View>
                      )}
                      {room.ceilingItems.CeilingTiles?.ceilingSheets > 0 && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>Ceiling Sheets:</Text>
                          <Text style={styles.valueText}>
                            {room.ceilingItems.CeilingTiles.ceilingSheets}{" "}
                            sheets
                          </Text>
                        </View>
                      )}
                      {room.ceilingItems.LongTs?.totalMainT12ft > 0 && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>Long Ts:</Text>
                          <Text style={styles.valueText}>
                            {room.ceilingItems.LongTs.totalMainT12ft} (12 ft
                            each)
                          </Text>
                        </View>
                      )}
                      {room.ceilingItems.smallTs?.totalCrossT2ft > 0 && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>Small Ts:</Text>
                          <Text style={styles.valueText}>
                            {room.ceilingItems.smallTs.totalCrossT2ft} (2 ft
                            each)
                          </Text>
                        </View>
                      )}
                      {room.ceilingItems.Ls?.totalL10ft > 0 && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>L-Angles:</Text>
                          <Text style={styles.valueText}>
                            {room.ceilingItems.Ls.totalL10ft} (10 ft each)
                          </Text>
                        </View>
                      )}
                      {room.ceilingItems.CeilingTiles?.totalCeilingTilesPrice >
                        0 && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>
                            Total Ceiling Tiles Price:
                          </Text>
                          <Text style={styles.valueText}>
                            RS.{" "}
                            {
                              room.ceilingItems.CeilingTiles
                                .totalCeilingTilesPrice
                            }
                          </Text>
                        </View>
                      )}

                      {room.ceilingItems.LongTs?.totalLongT12ftPrice > 0 && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>
                            Total Long T Price:
                          </Text>
                          <Text style={styles.valueText}>
                            RS. {room.ceilingItems.LongTs.totalLongT12ftPrice}
                          </Text>
                        </View>
                      )}

                      {room.ceilingItems.smallTs?.totalCrossT2ftPrice > 0 && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>
                            Total Small T Price:
                          </Text>
                          <Text style={styles.valueText}>
                            RS. {room.ceilingItems.smallTs.totalCrossT2ftPrice}
                          </Text>
                        </View>
                      )}
                      {room.ceilingItems.Ls?.totalL10ftPrice > 0 && (
                        <View style={styles.row}>
                          <Text style={styles.keyText}>
                            Total L-Angle Price:
                          </Text>
                          <Text style={styles.valueText}>
                            RS. {room.ceilingItems.Ls.totalL10ftPrice}
                          </Text>
                        </View>
                      )}
                      {room.ceilingItems.CeilingTiles &&
                        room.ceilingItems.Ls?.totalL10ftPrice > 0 &&
                        room.ceilingItems.smallTs?.totalCrossT2ftPrice > 0 &&
                        room.ceilingItems.CeilingTiles?.totalCeilingTilesPrice >
                          0 &&
                        room.ceilingItems.LongTs?.totalLongT12ftPrice > 0 && (
                          <View style={styles.row}>
                            <Text style={styles.keyText}>Total:</Text>
                            <Text style={styles.valueText}>
                              RS.{" "}
                              {room.ceilingItems.Ls?.totalL10ftPrice +
                                room.ceilingItems.smallTs?.totalCrossT2ftPrice +
                                room.ceilingItems.CeilingTiles
                                  ?.totalCeilingTilesPrice +
                                room.ceilingItems.LongTs?.totalLongT12ftPrice}
                            </Text>
                          </View>
                        )}
                    </Section>
                  )}

                  {/* Additional Materials Section */}
                  {room.additionalItems && room.additionalItems?.length > 0 && (
                    <Section
                      title="Additional Materials"
                      containerStyle={styles.InnerSectionStyles}
                    >
                      {room.additionalItems.map((item, i) => (
                        <View key={i} style={styles.row}>
                          <Text style={styles.keyText}>{item.name}:</Text>
                          <Text style={styles.valueText}>
                            Qty: {item.quantity} - Rs. {item.Totalprice}
                          </Text>
                        </View>
                      ))}

                      <View style={styles.row}>
                        <Text style={styles.keyText}>Total:</Text>
                        <Text style={styles.valueText}>
                          Rs.{" "}
                          {room.additionalItems.reduce(
                            (acc, item) => acc + (item.Totalprice || 0),
                            0
                          )}
                        </Text>
                      </View>
                    </Section>
                  )}
                  {room?.TotalCosts && (
                    <Section
                      title="Total Costs"
                      containerStyle={styles.InnerSectionStyles}
                    >
                      {room?.TotalCosts?.penalingLabourRate &&
                        room?.TotalCosts?.penalingLabourRate > 0 && (
                          <View style={styles.row}>
                            <Text style={styles.keyText}>
                              Penaling Labour Price
                            </Text>
                            <Text style={styles.valueText}>
                              Rs. {room.TotalCosts.penalingLabourRate}
                            </Text>
                          </View>
                        )}
                      {room?.TotalCosts?.ceilingLabourRate &&
                        room?.TotalCosts?.ceilingLabourRate > 0 && (
                          <View style={styles.row}>
                            <Text style={styles.keyText}>
                              Ceiling Labour Price
                            </Text>
                            <Text style={styles.valueText}>
                              Rs. {room.TotalCosts.ceilingLabourRate}
                            </Text>
                          </View>
                        )}

                      {room?.TotalCosts?.CompleteCeilingRateWithLabour &&
                        room?.TotalCosts?.CompleteCeilingRateWithLabour > 0 && (
                          <View style={styles.row}>
                            <Text style={styles.keyText}>
                              Ceiling Direct Rate with Labour
                            </Text>
                            <Text style={styles.valueText}>
                              Rs.{" "}
                              {room.TotalCosts.CompleteCeilingRateWithLabour}
                            </Text>
                          </View>
                        )}
                      {room?.TotalCosts?.CompleteCeilingRateWithoutLabour &&
                        room?.TotalCosts?.CompleteCeilingRateWithoutLabour >
                          0 && (
                          <View style={styles.row}>
                            <Text style={styles.keyText}>
                              Complete Direct Ceiling without Labour
                            </Text>
                            <Text style={styles.valueText}>
                              Rs.{" "}
                              {room.TotalCosts.CompleteCeilingRateWithoutLabour}
                            </Text>
                          </View>
                        )}
                    </Section>
                  )}
                </View>
                <View style={styles.saveCancelRow}>
                  <TouchableOpacity onPress={() => handleRoomEdit(room)}>
                    <Feather
                      name="edit"
                      size={24}
                      color={COLORS().primaryVariant}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRoomDelete(room?.id)}>
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={28}
                      color={COLORS().error}
                    />
                  </TouchableOpacity>
                </View>
              </Section>
            );
          })}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </ScreenWrapper>
  );
};

export default NewMeasure;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },

  staticButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS().background, // Optional: Add a background color
    padding: 10,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS().border,
    padding: 5,
    gap: 10,
  },
  saveCancelRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
    marginTop: 10,
    alignItems: "center",
  },
  saveBtn: {
    width: 100,
    height: 40,
    borderRadius: 10,
  },
  cancelBtn: {
    width: 100,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS().primaryDisabled,
  },
  titleInputWrapper: {
    gap: 5,
  },
  titleInput: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS().textSecondary,
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
  keyText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS().textPrimary,
    flex: 1,
  },
  valueText: {
    fontSize: 14,
    color: COLORS().textSecondary,
    textAlign: "right",
    flex: 1,
  },
});
