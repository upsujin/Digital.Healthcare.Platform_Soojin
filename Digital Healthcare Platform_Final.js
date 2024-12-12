//"Package.json" @React native, Snacks-Expo
//Before use this code, please install these package on the package.json.
/*{
  "dependencies": {
    "@expo/vector-icons": "^14.0.3",
    "react-native-paper": "4.9.2",
    "react-native-swiper": "1.6.0",
    "react-native-screens": "3.31.1",
    "react-native-webview": "13.8.6",
    "react-native-reanimated": "~3.10.1",
    "@react-navigation/drawer": "6.7.2",
    "@react-navigation/native": "6.1.18",
    "react-native-vector-icons": "10.2.0",
    "react-native-gesture-handler": "~2.16.1",
    "@react-navigation/bottom-tabs": "6.6.1",
    "@react-navigation/native-stack": "6.9.0",
    "react-native-safe-area-context": "4.10.5",
    "react-native-vector-icons/MaterialIcons": "*"
  }
}
*/
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {View,Text,StyleSheet,Image,TextInput,TouchableOpacity,SafeAreaView,FlatList,ScrollView,Alert,Linking} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swiper from 'react-native-swiper'; // Swiper 라이브러리 임포트
import { Ionicons } from '@expo/vector-icons'; // 아이콘 사용

const carouselImages = [
  { id: 1, image: 'https://sev.severance.healthcare/_attach/yuhs/editor-image/2024/05/lfHBHHoXaRHQGzIJesWqrDTtQx.jpg' },
  { id: 2, image: 'https://www.mohw.go.kr/upload/popupzone/a1/20240509152153088.jpg' },
  { id: 3, image: 'https://www.mohw.go.kr/upload/popupzone/a1/20241118131436031.jpg' },
];

// **HomeScreen**
const HomeScreen = ({ navigation }) => {
  const openDiseaseEncyclopedia = () => {
    const url = 'https://www.paik.ac.kr/busan/user/bbs/BMSR00052/list.do?menuNo=800019&initialSearch=1&pageIndex=1&searchCondition=&searchKeyword=';
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  // To-do 리스트 상태 관리
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task) {
      setTasks([...tasks, { id: Date.now().toString(), text: task }]); // 고유한 ID 추가
      setTask('');
    }
  };

  const deleteAllTasks = () => {
    setTasks([]); // 모든 할 일을 삭제
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        {/* 상단 캐러셀 */}
        <View style={styles.swiperContainer}>
        <Swiper autoplay autoplayTimeout={3} showsPagination dotStyle={styles.dot} 
        activeDotStyle={styles.activeDot}>
          {carouselImages.map((item) => (
            <View key={item.id} style={styles.slide}>
              <Image source={{ uri: item.image }} style={styles.carouselImage} />
            </View>
            ))}
          </Swiper>
        </View>

        {/* 검색창 */}
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="검색어를 입력하세요" placeholderTextColor="#aaa" />
        </View>

        {/* 원형 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.circleButton} onPress={openDiseaseEncyclopedia}>
            <Text style={styles.buttonText}>질병백과</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.circleButton} 
            onPress={() => navigation.navigate('SymptomsList')} // 증상별 화면으로 이동
          >
            <Text style={styles.buttonText}>진료과 추천</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.circleButton} 
            onPress={() => navigation.navigate('QnA')}
          >
            <Text style={styles.buttonText}>Q&A</Text>
          </TouchableOpacity>
        </View>

        {/* To-do 리스트 */}
        <View style={styles.todoContainer}>
          <Text style={styles.todoHeader}>
            <Ionicons name="checkbox" size={20} color="deepskyblue" /> Memo
          </Text>
          <View style={styles.todoInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a task..."
              value={task}
              onChangeText={(text) => setTask(text)}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={deleteAllTasks}>
              <Text style={styles.buttonText}>Delete All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.taskContainer}>
                <Text style={styles.taskText}>{item.text}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


// **SearchScreen**
function SearchScreen({navigation}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/upsujin/Digital.Healthcare.Platform_Soojin/refs/heads/main/JSON%20data.json'
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, []);

    const handleItemPress = (category) => {
    switch (category) {
      case '증상별':
        navigation.navigate('SymptomsList'); // 증상별 화면으로 이동
        break;
      case '전문분야별':
        navigation.navigate('DiseaseList'); // 질병별 화면으로 이동
        break;
      case '지역별':
        // 지역별 클릭 시, 웹사이트로 이동
        Linking.openURL('https://www.hira.or.kr/ra/hosp/getHealthMap.do'); // 건강보험심사평가원 웹사이트로 이동
        break;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item.name)}>
      <View style={styles.card}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={data} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />
    </SafeAreaView>
  );
}

// **SymptomsListScreen** - 증상별 화면
function SymptomsListScreen({ navigation }) {
  const [conditions, setConditions] = useState([]);

  useEffect(() => {
    // JSON 파일을 외부에서 가져오기
    fetch('https://raw.githubusercontent.com/upsujin/Digital.Healthcare.Platform_Soojin/refs/heads/main/sympton.json')
      .then(response => response.json())
      .then(data => {
        // 증상 목록만 추출하여 상태에 저장
        const conditionsList = Object.keys(data);
        setConditions(conditionsList);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <ScrollView style={styles.container}>
      {conditions.map((condition, index) => (
        <TouchableOpacity
          key={index}
          style={styles.conditionBox}
          onPress={() => navigation.navigate('DiseaseScreen', { condition: condition })}
        >
          <Text style={styles.conditionText}>{condition}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// 선택된 증상에 따른 질병 정보 화면
function DiseaseScreen({ route }) {
  const { condition } = route.params;
  const [diseases, setDiseases] = useState([]);

  useEffect(() => {
    // JSON 파일을 외부에서 가져오기
    fetch('https://raw.githubusercontent.com/upsujin/Digital.Healthcare.Platform_Soojin/refs/heads/main/sympton.json') 
      .then(response => response.json())
      .then(data => {
        // 선택된 증상에 해당하는 질병 데이터만 필터링
        const conditionDiseases = data[condition];
        setDiseases(conditionDiseases);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [condition]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titleBox}> {condition} 관련 질병 </Text>
      {diseases.map((disease, index) => (
        <View key={index} style={styles.diseaseBox}>
          <Text style={styles.diseaseTitle}>{disease.disease}</Text>
          <Text style={styles.diseaseText}>증상: {disease.symptoms}</Text>
          <Text style={styles.diseaseText}>관련 질병: {disease.associatedDiseases}</Text>
          <Text style={styles.diseaseText}>추천 진료과: {disease.specialty}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function DiseaseListScreen({ navigation }) {
  const [dummyData, setDummyData] = useState([]);
  const [categories, setCategories] = useState([]);

  // JSON 파일 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/upsujin/Digital.Healthcare.Platform_Soojin/refs/heads/main/DiseaseList.json"
        ); // JSON 파일 경로
        const data = await response.json();
        setDummyData(data);

        // 전문분야 추출 및 중복 제거
        const uniqueCategories = [
          ...new Set(data.map((item) => item.전문분야)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching JSON data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>전문 분야 선택</Text>
        <View style={styles.categoryButtonContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.categoryButton}
              onPress={() =>
                navigation.navigate("DiseaseSpecificScreen", {
                  category,
                  dummyData,
                })
              }
            >
              <Text style={styles.categoryButtonText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DiseaseSpecificScreen({ route, navigation }) {
  const { category, dummyData } = route.params;

  // 필터링된 병원 데이터
  const filteredHospitals = dummyData.filter(
    (item) => item.전문분야 === category
  );

  const renderHospital = ({ item }) => (
    <View style={styles.hospitalCard}>
      <Text style={styles.hospitalTitle}>{item.병원명}</Text>
      <Text style={styles.hospitalDetail}>전문분야: {item.전문분야}</Text>
      <Text style={styles.hospitalDetail}>전화번호: {item.전화번호}</Text>
      <Text style={styles.hospitalDetail}>주소: {item.소재지주소}</Text>
      {item.홈페이지 && (
        <TouchableOpacity>
          <Text style={styles.hospitalLink}>홈페이지: {item.홈페이지}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{category} 병원 목록</Text>
      <FlatList
        data={filteredHospitals}
        renderItem={renderHospital}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.categoryButtonText}>뒤로 가기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


function InformationScreen() {
  // 이미지와 링크 정보 
  const images = [
    {
      uri: 'https://www.weknew.com/card/card_img.php?host=202406&img=20240621085757561.jpg',
      link: 'https://www.weknew.com/card/card_view.php?no=l1MEY9PLTxsd6MWFYT3KrA%3D%3D', // 링크 주소
    },
    {
      uri: 'https://www.weknew.com/card/card_img.php?host=202212&img=20221216094854711.jpg',
      link: 'https://www.weknew.com/card/card_view.php?no=oG4yfHjGwOpyDHK5C4afvA%3D%3D', // 링크 주소
    },
    {
      uri: 'https://www.weknew.com/card/card_img.php?host=202305&img=20230518170221575.jpg',
      link: 'https://www.weknew.com/card/card_view.php?no=AlVGerDWlNtfcppdDwIVoA%3D%3D', // 링크 주소
    },
    {
      uri: 'https://www.weknew.com/card/card_img.php?host=202212&img=20221215150537532.jpg',
      link: 'https://www.weknew.com/card/card_view.php?no=YVObEKyUjujEAFNxMw%2F5hg%3D%3D', // 링크 주소
    },
    {
      uri: 'https://www.weknew.com/card/card_img.php?host=202305&img=20230518163613160.jpg',
      link: 'https://www.weknew.com/card/card_view.php?no=zp1jZVaLFuHT9OgKBXSR8g%3D%3D', // 링크 주소
    },
    {
      uri: 'https://www.weknew.com/card/card_img.php?host=202307&img=20230704165707408.jpg',
      link: 'https://www.weknew.com/card/card_view.php?no=bvhDPqNDEd9PB%2BzOTA3pSA%3D%3D', // 링크 주소
    },
    {
      uri: 'https://www.weknew.com/card/card_img.php?host=202305&img=20230516134810262.jpg',
      link: 'https://www.weknew.com/card/card_view.php?no=1AuOunLrQcXwscmp2EkL7g%3D%3D', // 링크 주소
    },
    {
      uri: 'https://www.weknew.com/card/card_img.php?host=202402&img=20240216090521539.jpg',
      link: 'https://www.weknew.com/card/card_view.php?no=RjYut3YeQytLMjdUAkCr0g%3D%3D', // 링크 주소
    },

  ];

  // 이미지를 클릭했을 때 링크로 이동하는 함수
  const handleImageClick = (link) => {
    Linking.openURL(link); // 링크로 이동
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          {/* 이미지를 2개씩 나열 */}
          {images.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.imageWrapper}
              onPress={() => handleImageClick(item.link)} // 이미지 클릭 시 링크로 이동
            >
              <Image
                source={{ uri: item.uri }}
                style={styles.image}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// **CommunityScreen**
function CommunityScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.communityContainer}>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.QnAcommunityButton}
          onPress={() => navigation.navigate('QnA')}
        >
          <Text style={styles.communitybuttonText}>의료진과의 Q&A</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.communityButton}
          onPress={() => navigation.navigate('ChatRoom')}
        >
          <Text style={styles.communitybuttonText}>당뇨병 소통방</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.communityButton}
          onPress={() => navigation.navigate('ChatRoom')}
        >
          <Text style={styles.communitybuttonText}>난임 소통방</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.communityButton}
          onPress={() => navigation.navigate('ChatRoom')}
        >
          <Text style={styles.communitybuttonText}>유전 질환 소통방</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.communityButton}
          onPress={() => navigation.navigate('ChatRoom')}
        >
          <Text style={styles.communitybuttonText}>척추 질환 소통방</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
function ChatRoomScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // 메시지 전송 함수
  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, id: Date.now() }]);
      setInput('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
       {/* 메시지 목록을 표시하는 FlatList */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messageContainer}
      />
      <View style={styles.messageinputContainer}>
        {/* 메시지 입력 필드 */}
        <TextInput
          style={styles.messageinput}
          placeholder="메시지를 입력하세요"
          value={input}
          onChangeText={(text) => setInput(text)}
        />
        {/* 메시지 전송 버튼 */}
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function QnAScreen() {
  const [questions, setQuestions] = useState([]);
  const [questionInput, setQuestionInput] = useState('');
  const [answerInput, setAnswerInput] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const addQuestion = () => {
    if (questionInput.trim()) {
      setQuestions([
        ...questions,
        { id: Date.now(), question: questionInput, answers: [] },
      ]);
      setQuestionInput('');
    }
  };

  const addAnswer = () => {
    if (answerInput.trim() && selectedQuestionId !== null) {
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === selectedQuestionId
            ? { ...q, answers: [...q.answers, { id: Date.now(), text: answerInput }] }
            : q
        )
      );
      setAnswerInput('');
      setSelectedQuestionId(null); // 답변 추가 후 선택된 질문 ID 초기화
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>무엇이든 물어보세요!</Text>

      {/* 질문 입력 영역 */}
      <View>
        <TextInput
          style={styles.QnAinput}
          placeholder="질문을 입력하세요"
          value={questionInput}
          onChangeText={setQuestionInput}
        />
        <TouchableOpacity style={styles.QnAaddButton} onPress={addQuestion}>
          <Text style={styles.addButtonText}>등록</Text>
        </TouchableOpacity>
      </View>

      {/* 등록된 질문 리스트 */}
      {questions.map((q) => (
        <View key={q.id} style={styles.questionContainer}>
          <Text style={styles.questionText}>{q.question}</Text>
          
          {/* 답변 목록 */}
          <FlatList
            data={q.answers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.answer}>
                <Text>{item.text}</Text>
              </View>
            )}
          />

          {/* 답변 추가 버튼 */}
          <TouchableOpacity onPress={() => setSelectedQuestionId(q.id)}>
            <Text style={styles.addAnswerText}>답변 추가</Text>
          </TouchableOpacity>

          {/* 선택된 질문에 답변 입력 */}
          {selectedQuestionId === q.id && (
            <View style={styles.answerInputContainer}>
              <TextInput
                style={styles.QnAinput}
                placeholder="답변을 입력하세요"
                value={answerInput}
                onChangeText={setAnswerInput}
              />
              <TouchableOpacity style={styles.answeraddButton} onPress={addAnswer}>
                <Text style={styles.addButtonText}>답변 등록</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </SafeAreaView>
  );
}


// **LoginScreen**
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const JSON_URL = 'https://raw.githubusercontent.com/upsujin/Digital.Healthcare.Platform_Soojin/refs/heads/main/login%20data.json';

    fetch(JSON_URL)
      .then(response => response.json())
      .then(users => {
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
          navigation.navigate('Welcome', { userName: user.name, userProfileImg: user.profile }); // WelcomeScreen으로 이동
        } else {
          Alert.alert('로그인 실패', '이메일 또는 비밀번호가 일치하지 않습니다.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('에러 발생', '로그인 요청 중 문제가 발생했습니다.');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContent}>
        <Image
                  source={{
                    uri: 'https://item.kakaocdn.net/do/27427858d51f49001a452673fd2a32eaf604e7b0e6900f9ac53a43965300eb9a',
                  }} style={styles.loginImage}/>
        <TextInput
          style={styles.inputContainer}
          placeholder="이메일 입력"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.inputContainer}
          placeholder="비밀번호 입력"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const WelcomeScreen = ({ route }) => {
  const { userName, userProfileImg } = route.params;
  return (
    <View style={styles.welcomecontainer}>
      <Image source = {{ uri: userProfileImg }} style={styles.welcomeImge}/>
      <Text style={styles.welcometext} >환영합니다, {userName}!</Text>
    </View>
  );
};

// **Tab Navigator**
const Tab = createBottomTabNavigator();

// **Main Tab Screens**
function MainTabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: '홈',
          headerTitle: 'Health Navigator',
          headerRight: () => (
            <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Login')}>
              <Image
                source={{
                  uri: 'https://item.kakaocdn.net/do/27427858d51f49001a452673fd2a32eaf604e7b0e6900f9ac53a43965300eb9a',
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        })}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={({ navigation }) => ({
          title: '병원검색',
          headerRight: () => (
            <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Login')}>
              <Image
                source={{
                  uri: 'https://item.kakaocdn.net/do/27427858d51f49001a452673fd2a32eaf604e7b0e6900f9ac53a43965300eb9a',
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => <Icon name="search" color={color} size={size} />,
        })}
      />
      <Tab.Screen
        name="Information"
        component={InformationScreen}
        options={({ navigation }) => ({
          title: '건강정보',
          headerRight: () => (
            <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Login')}>
              <Image
                source={{
                  uri: 'https://item.kakaocdn.net/do/27427858d51f49001a452673fd2a32eaf604e7b0e6900f9ac53a43965300eb9a',
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => <Icon name="notifications" color={color} size={size} />,
        })}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={({ navigation }) => ({
          title: '커뮤니티',
          headerRight: () => (
            <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Login')}>
              <Image
                source={{
                  uri: 'https://item.kakaocdn.net/do/27427858d51f49001a452673fd2a32eaf604e7b0e6900f9ac53a43965300eb9a',
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => <Icon name="message" color={color} size={size} />,
        })}
      />
    </Tab.Navigator>
  );
}

// **App Component**
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs">
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false, title: '이전' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: '로그인' }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ title: 'Welcome' }} />
        <Stack.Screen name="SymptomsList" component={SymptomsListScreen} options={{ title: '증상 선택' }} />
        <Stack.Screen name="DiseaseScreen" component={DiseaseScreen} options={{ title: '질병 정보' }} />
        <Stack.Screen
          name="DiseaseList"
          component={DiseaseListScreen}
          options={{ title:  null }}
        />
        <Stack.Screen
          name="DiseaseSpecificScreen"
          component={DiseaseSpecificScreen}
          options={({ route }) => ({ title:  null  })}
        />
        {/* 소통방 */}
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={{ title: '소통방' }} />
        <Stack.Screen name="QnA" component={QnAScreen} options={{ title: 'Q&A' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// **Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    backgroundColor: 'white',
    padding: 8,
  },
  titleBox: {
    fontSize: 25,             // 글씨 크기
    fontWeight: 'bold',       // 글씨 두께
    color: 'black',           // 글씨 색상
    backgroundColor: 'rgba(135,206,250, 0.2)', // 박스 배경 색상 (원하는 색으로 변경 가능)
    padding: 20,             // 내부 여백
    borderRadius: 40,        // 모서리 둥글게 처리
    marginBottom: 10,        // 아래 여백
    textAlign: 'center',     // 텍스트 가운데 정렬
    marginHorizontal: 20,    // 좌우 여백 (화면에 따라 조정 가능)
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileIcon: {
    marginRight: 15, // 오른쪽 여백
  },
  profileImage: {
    width: 40, // 이미지 크기
    height: 40,
    borderRadius: 20, // 원형
    backgroundColor: '#ddd',
  },
  loginContent: {
    flex: 1,
    justifyContent: 'center', // 이미지와 입력칸을 중앙에 배치
    alignItems: 'center',
  },
  loginImage: {
    width: 250, // 이미지 크기
    height: 250,
    marginBottom: 40, // 이미지와 입력칸 사이 간격
  },
  swiperContainer: {
    height: 220,
    marginTop: 15,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '95%',
    height: 200,
    borderRadius: 10,
  },
  dot: {
    backgroundColor: '#ccc',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#87CEEB',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  searchContainer: {
    marginTop: 5,
    paddingHorizontal: 20,
  },
  searchInput: {
    height: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  circleButton: {
    width: 100,
    height: 100,
    borderRadius: 80,
    backgroundColor: 'rgba(135, 206, 235,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: 'rgba(135,206,250, 0.2)',
    padding: 30,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 15,
    borderWidth: 2,
    elevation: 3,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    height: 50, // 고정된 높이
    width: 350, // 고정된 너비로 설정
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#87CEEB',
    padding: 15, // 버튼 크기를 키움
    borderRadius: 20,
    alignItems: 'center',
    width: 300, // 고정된 너비
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  welcomecontainer:{ 
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  welcomeImge :{
    width: 250, height: 250, borderRadius: 100, marginBottom: 20,
  },
  welcometext :{
   fontSize: 24,
   color:'hotpink',
   },
   conditionBox: {
    backgroundColor: '#f2f2f2',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  conditionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  diseaseBox: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  diseaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  diseaseText: {
    fontSize: 16,
    marginVertical: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  categoryButtonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly", // 각 행의 버튼 간격을 균등하게 설정
  },
  categoryButton: {
    backgroundColor: "rgba(154, 206, 227,0.8)",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    margin: 10, // 버튼 간 간격
    minWidth: "30%", 
    alignItems: "center",
    justifyContent: "center",
  },
  categoryButtonText: { 
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  hospitalCard: { 
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  hospitalTitle: { 
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  hospitalDetail: { 
    fontSize: 14,
    marginBottom: 5,
  },
  hospitalLink: {
    fontSize: 14,
    color: "#007BFF",
  },
  backButton: {
    backgroundColor: "silver",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  imageContainer: {
    flexDirection: 'row', // 두 개씩 나열하기 위해 row 방향
    flexWrap: 'wrap', // 넘치면 다음 줄로 내려가게
    justifyContent: 'space-between', // 간격 맞추기
  },
  imageWrapper: {
    width: '48%', // 두 개씩 배치하려면 각 이미지가 차지할 너비를 48%로 설정
    marginBottom: 20,
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 200, // 이미지 높이
    borderRadius: 10, // 이미지 모서리를 둥글게
    resizeMode: 'cover', // 이미지 비율 유지
  },
   // To-do 리스트 스타일
  todoContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  todoHeader: {
    padding: 5,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  todoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#a2d5f2',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#ffaaa7',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,245,238,0.5)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
  },
   messageContainer: {
    padding: 30,
    alignItems: 'center',
  },
  message: {
    backgroundColor: '#d3f8d3',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  sendButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },

  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  messageinput: {
  height: 60, // 메시지 입력 칸 두껍게 설정
  padding: 15,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 10,
  backgroundColor: '#f9f9f9',
  width: '85%', // 적당한 크기로 입력칸 크기 설정
  marginRight: 10, // 버튼과 간격 추가
},
messageinputContainer: {
  flexDirection: 'row',
  justifyContent: 'center', // 중앙 정렬
  alignItems: 'center',
  paddingHorizontal: 10,
  marginBottom: 20,
},
  communityContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  buttonWrapper: {
    flexDirection: 'column', // 세로 정렬
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30, // 상단 여백 추가
  },
  communityButton: {
    backgroundColor: 'rgba(255,228,225,0.5)', // 버튼 색상
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 12, // 버튼 사이 간격 추가
    borderRadius: 8, // 버튼 둥글게
    width: '90%', // 버튼 크기 설정
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  QnAcommunityButton: {
    backgroundColor: 'rgb(255,228,225)', // 버튼 색상
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 12, // 버튼 사이 간격 추가
    borderRadius: 8, // 버튼 둥글게
    width: '90%', // 버튼 크기 설정
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  communitybuttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  QnAinput: {
    height: 50,
    padding: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    width: '100%',
    marginBottom: 10, // 질문 입력칸과 등록 버튼 사이 간격
  },
  QnAaddButton: {
    backgroundColor: 'rgb(255,228,225)', // 버튼 색상
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '100%', // 버튼 크기 설정
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  questionContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center', // 질문을 가로로 가운데 정렬
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  answer: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    textAlign: 'left',
  },
  addAnswerText: {
    color: '#007bff',
    marginBottom: 10,
  },
  answerInputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },
  answeraddButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
});

export default App;
