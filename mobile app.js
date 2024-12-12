//"Package.json" @React native, Snacks-Expo
//Before use this code, please install these package on the package.json.
/*{
  "dependencies": {
    "@expo/vector-icons": "^14.0.3",
    "react-native-paper": "4.9.2",
    "react-native-vector-icons": "10.2.0",
    "react-native-vector-icons/FontAwesome": "*"
  }
}
*/

import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const stories = [
  { id: '1', user: '당뇨병', image: 'https://health.severance.healthcare/app/board/attach/image/thumb_56482_1701148111340.do' },
  { id: '2', user: '고혈압', image: 'https://health.severance.healthcare/app/board/attach/image/thumb_25411_1605067106763.do' },
  { id: '3', user: '골다공증', image: 'https://health.severance.healthcare/app/board/attach/image/thumb_56295_1699324188040.do' },
  { id: '4', user: '공항장애', image: 'https://health.severance.healthcare/app/board/attach/image/thumb_26716_1605676025563.do' }
];

const posts = [
  { id: '1', user: '공지사항', image: 'https://sev.severance.healthcare/_attach/yuhs/editor-image/2024/05/lfHBHHoXaRHQGzIJesWqrDTtQx.jpg', caption: '원활한 접수를 위해 병·의원 내원 시 환자 본인의 신분증을 꼭 지참해 주세요.' },
  { id: '2', user: '건강정보', image: 'https://news.amc.seoul.kr/news/file/imageView.do?fileId=F000000631491_QLBGBY', caption: '제로 슈거 식품 계속 먹어도 안전할까?' },
  { id: '3', image: 'https://news.amc.seoul.kr/news/file/imageView.do?fileId=F000000625771_WNFrsq', caption: '방사선 치료, 힘들거나 견디지 못 할까봐 걱정되시나요?' }
];

const Story = ({ user, image }) => (
  <View style={styles.story}>
    <Image source={{ uri: image }} style={styles.storyImage} />
    <Text style={styles.storyUser}>{user}</Text>
  </View>
);

const Post = ({ user, image, caption }) => (
  <View style={styles.post}>
    <View style={styles.header}>
      <Text style={styles.username}>{user}</Text>
    </View>
    <Image source={{ uri: image }} style={styles.image} />
    <Text style={styles.caption}>{caption}</Text>
  </View>
);

const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <Text style={{padding:5, color:'black', fontWeight:'bold', fontSize:30, textAlign:'center'}}>
          <Icon name="hospital-o" size={30} color="#4374D9" />
            HealthNavigator
          <Icon name="hospital-o" size={30} color="#4374D9" />
        </Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Stories Section */}
        <View style={styles.storiesContainer}>
          <FlatList
            data={stories}
            horizontal
            renderItem={({ item }) => <Story user={item.user} image={item.image} />}
            keyExtractor={item => item.id}
          />
        </View>
        {/* Posts Section */}
        <FlatList
          data={posts}
          renderItem={({ item }) => <Post user={item.user} image={item.image} caption={item.caption} />}
          keyExtractor={item => item.id}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  storiesContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  story: {
    alignItems: 'center',
    marginRight: 10,
  },
  storyImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  storyUser: {
    marginTop: 5,
    fontSize: 12,
  },
  post: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
  },
  caption: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
});

export default App;
