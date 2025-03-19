import { Tabs } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

export default function TabsLayout() {
  const authContext = useContext(AuthContext);
  if (!authContext || !authContext.user) return null;

  return (
    <Tabs>
      <Tabs.Screen name="studentDashboard" options={{ title: 'Student Dashboard' }} />
      <Tabs.Screen name="professorDashboard" options={{ title: 'Professor Dashboard' }} />
      <Tabs.Screen name="adminDashboard" options={{ title: 'Admin Dashboard' }} />
    </Tabs>
  );
}
