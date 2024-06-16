import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";
import SignInScreen from "./src/screens/SignInScreen.js";
import SignUpScreen from "./src/screens/SignUpScreen.js";
import SignupOptionsScreen from "./src/screens/SignUpOptions.js";
import ClientScreen from "./src/screens/ClientScreen.js";
import ArchitectScreen from "./src/screens/ArchitectScreen.js";
import ContractorScreen from "./src/screens/ContractorScreen.js";
import InteriorDesignerScreen from "./src/screens/InteriorDesignerScreen.js";
import TransactionScreen from "./src/screens/TransactionScreen.js";
import AppointmentScreen from "./src/screens/AppointmentScreen.js";
import ScheduleMeetingScreen from "./src/screens/ScheduleMeetingScreen.js";
import BiddingListScreen from "./src/screens/BiddingListScreen.js";
import BiddingSearchScreen from "./src/screens/BiddingSearchScreen.js";
import BiddingScreen from "./src/screens/BiddingScreen.js";
import UploadProposal from "./src/screens/UploadProposalScreen.js";
import WorkerOptions from "./src/screens/WorkerOptionsScreen.js";
import ProfileScreen from "./src/screens/ProfileScreen.js";
import WorkerProfileScreen from "./src/screens/WorkerProfileSreen.js";
import HomeScreen from "./src/screens/HomeScreen.js";
import WorkerHomeScreen from "./src/screens/WorkerHomeScreen.js";
import BidToProposal from "./src/screens/BidToProposal.js";
import WPS_Client from "./src/screens/WPS_Client.js";
import { Provider as AuthProvider } from "./src/context/authContext.js";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setNavigator } from "./src/navigationRef.js";
import { Provider as ProposalProvider } from "./src/context/proposalContext.js";
import NotificationsScreen from "./src/screens/NotificationScreen.js";
import WorkerProjectsScreen from "./src/screens/WorkerProjects.js";
import { Provider as AppointmentProvider } from "./src/context/appointmentContext.js";
import WorkerAppointmentScreen from "./src/screens/WorkerAppointmentScreen.js";
import MeetingsScreen from "./src/screens/MeetingsScreen.js";
import WorkerDetail from "./src/screens/WorkerDetailScreen.js";
import AdminHomeScreen from "./src/screens/AdminHomeScreen.js";
import UnBlockWorkerScreen from "./src/screens/unBlockWorkerScreen.js";
import MonthlyReportScreen from "./src/screens/MothlyReportScreen.js";
import ClientProjectsScreen from "./src/screens/ClientProjectScreen.js";
import ClientMonthlyReportScreen from "./src/screens/ClientMonthlyReportScreen.js";
import WorkerTransactionScreen from "./src/screens/WorkerTransactionScreen.js";
import AiScreen from "./src/screens/RecommendScreen.js";
import PredictScreen from "./src/screens/PredictScreen.js";
import RecommendScreen from "./src/screens/RecommendScreen.js";
import AiOptionsScreen from "./src/screens/AiOptionScreen.js";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AppointmentProvider>
        <ProposalProvider>
          <AuthProvider>
            <NavigationContainer
              ref={(navigator) => {
                setNavigator(navigator);
              }}
            >
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen
                  name="SignUpOptions"
                  component={SignupOptionsScreen}
                />
                <Stack.Screen name="Client" component={ClientScreen} />
                <Stack.Screen name="Architect" component={ArchitectScreen} />
                <Stack.Screen
                  name="InteriorDesigner"
                  component={InteriorDesignerScreen}
                />
                <Stack.Screen name="Contractor" component={ContractorScreen} />
                <Stack.Screen
                  name="Transaction"
                  component={TransactionScreen}
                />
                <Stack.Screen
                  name="Appointment"
                  component={AppointmentScreen}
                />
                <Stack.Screen
                  name="ScheduleMeeting"
                  component={ScheduleMeetingScreen}
                />

                <Stack.Screen name="Bidding" component={BiddingScreen} />
                <Stack.Screen name="Proposal" component={UploadProposal} />
                <Stack.Screen name="WorkerOption" component={WorkerOptions} />

                <Stack.Screen
                  name="BiddingSearchScreen"
                  component={BiddingSearchScreen}
                />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen
                  name="WorkerProfileScreen"
                  component={WorkerProfileScreen}
                />
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                <Stack.Screen
                  name="WorkerHomeScreen"
                  component={WorkerHomeScreen}
                />
                <Stack.Screen name="BidToProposal" component={BidToProposal} />
                <Stack.Screen name="WPS_Client" component={WPS_Client} />
                <Stack.Screen
                  name="Notification"
                  component={NotificationsScreen}
                />
                <Stack.Screen
                  name="WorkerProjectsScreen"
                  component={WorkerProjectsScreen}
                />
                <Stack.Screen
                  name="WorkerAppointment"
                  component={WorkerAppointmentScreen}
                />
                <Stack.Screen
                  name="MeetingsScreen"
                  component={MeetingsScreen}
                />
                <Stack.Screen
                  name="WorkerDetailScreen"
                  component={WorkerDetail}
                />
                <Stack.Screen
                  name="AdminHomeScreen"
                  component={AdminHomeScreen}
                />
                <Stack.Screen
                  name="UnBlockWorkerScreen"
                  component={UnBlockWorkerScreen}
                />
                <Stack.Screen
                  name="MonthlyReportScreen"
                  component={MonthlyReportScreen}
                />
                <Stack.Screen
                  name="ClientProjectsScreen"
                  component={ClientProjectsScreen}
                />
                <Stack.Screen
                  name="ClientMonthlyReportScreen"
                  component={ClientMonthlyReportScreen}
                />
                <Stack.Screen
                  name="WorkerTransactionScreen"
                  component={WorkerTransactionScreen}
                />
                <Stack.Screen name="PredictScreen" component={PredictScreen} />
                <Stack.Screen
                  name="RecommendScreen"
                  component={RecommendScreen}
                />
                <Stack.Screen
                  name="AiOptionsScreen"
                  component={AiOptionsScreen}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </AuthProvider>
        </ProposalProvider>
      </AppointmentProvider>
    </SafeAreaProvider>
  );
}
