import React from 'react';
import {ScrollView, View} from 'react-native';
import {
  Avatar,
  Button,
  Divider,
  Layout,
  StyleService,
  Text,
  useStyleSheet,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {LargeDrawerIcon} from '../../../components/icons';
import {ProfileStats} from '../../../components/profile/profileStats';

export const UserProfileScreen = ({navigation}) => {
  const styles = useStyleSheet(themedStyle);
  const openDrawer = () => {
    navigation.openDrawer();
  };

  const DrawerAction = () => (
    <TopNavigationAction icon={LargeDrawerIcon} onPress={openDrawer} />
  );

  return (
    <>
      <TopNavigation
        title="Name"
        alignment="center"
        accessoryLeft={DrawerAction}
      />
      <Divider />
      <ScrollView style={styles.contentContainer}>
        <Layout style={styles.header} level="1">
          <View style={styles.profileContainer}>
            <View style={styles.profileDetailsContainer}>
              <Text category="h4">Pip Sutton</Text>
              <View style={styles.profileLocationContainer}>
                <Text
                  style={styles.profileLocation}
                  appearance="hint"
                  category="s1">
                  Philadelphia
                </Text>
              </View>
            </View>
            <Avatar
              style={styles.profileAvatar}
              size="giant"
              shape="square"
              source={{
                uri:
                  'https://thumbor.forbes.com/thumbor/fit-in/416x416/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5f47d4de7637290765bce495%2F0x0.jpg%3Fbackground%3D000000%26cropX1%3D1398%26cropX2%3D3908%26cropY1%3D594%26cropY2%3D3102',
              }}
            />
          </View>
          <View style={styles.profileButtonsContainer}>
            <Button style={styles.profileButton}>FOLLOW</Button>
            <Button appearance="filled" style={styles.profileButton}>
              MESSAGE
            </Button>
          </View>
          <Divider style={styles.profileSocialsDivider} />
          <View style={styles.profileSocialsContainer}>
            <ProfileStats hint="Followers" value={367097} />
            <ProfileStats hint="Following" value={542} />
            <ProfileStats hint="Posts" value={214} />
          </View>
        </Layout>
      </ScrollView>
    </>
  );
};

const themedStyle = StyleService.create({
  contentContainer: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  header: {
    padding: 16,
  },
  profileContainer: {
    flexDirection: 'row',
  },
  profileDetailsContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  profileLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileLocation: {
    marginHorizontal: 8,
  },
  profileAvatar: {
    marginHorizontal: 8,
    borderRadius: 5,
  },
  profileButtonsContainer: {
    flexDirection: 'row',
    marginVertical: 24,
  },
  profileButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  profileSocialsDivider: {
    marginHorizontal: -16,
  },
  profileSocialsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 24,
    marginBottom: 8,
  },
  postsList: {
    paddingHorizontal: 8,
  },
  postItem: {
    width: 144,
    height: 144,
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
});
