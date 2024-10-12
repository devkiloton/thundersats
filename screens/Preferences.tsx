import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  Text,
  List,
  MD3Colors,
  Appbar,
} from "react-native-paper";
import { deleteUser, getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export const Preferences = () => {
  const [isLogoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [isDeleteAccountDialogVisible, setDeleteAccountDialogVisible] =
    useState(false);
  const navigation = useNavigation();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigation.reset({ index: 0, routes: [] });
  };

  const handleDeleteAccount = async () => {
    const auth = getAuth();

    const user = auth.currentUser;
    if (user) {
      await deleteUser(user);
      navigation.reset({ index: 0, routes: [] });
    }
  };

  return (
    <View>
      <Appbar.Header mode="small">
        <Appbar.Content title="Preferences" />
      </Appbar.Header>

      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          style={styles.item}
          onPress={() => setLogoutDialogVisible(true)}
          title="Logout"
          left={() => <List.Icon icon="logout" />}
        />
        <List.Item
          style={styles.item}
          onPress={() => setDeleteAccountDialogVisible(true)}
          title="Delete Account"
          titleStyle={{ color: MD3Colors.error50 }}
          left={() => (
            <List.Icon color={MD3Colors.error50} icon="sign-caution" />
          )}
        />
      </List.Section>

      {/* Logout Dialog */}
      <Portal>
        <Dialog
          style={{ shadowColor: "transparent" }}
          visible={isLogoutDialogVisible}
          onDismiss={() => setLogoutDialogVisible(false)}
        >
          <Dialog.Title>Confirm Logout</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to log out?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={handleLogout}>Logout</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Delete Account Dialog */}
      <Portal>
        <Dialog
          style={{ shadowColor: "transparent" }}
          visible={isDeleteAccountDialogVisible}
          onDismiss={() => setDeleteAccountDialogVisible(false)}
        >
          <Dialog.Title>Confirm Account Deletion</Dialog.Title>
          <Dialog.Content>
            <Text>
              You're about to delete your account and it can't be undone
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteAccountDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={handleDeleteAccount}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  item: {
    paddingHorizontal: 16,
  },
});