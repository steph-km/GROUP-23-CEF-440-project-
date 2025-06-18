import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { getCurrentNetworkInfo, logDailyNetworkSummary } from './networkUtils';

const TASK_NAME = 'network-monitor-task';

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    console.log('Running background network monitoring task...');
    console.log('Background task ran at:', new Date().toLocaleString()); // ✅ Added timestamp log
    await getCurrentNetworkInfo();
    await logDailyNetworkSummary();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (err) {
    console.warn('Background task failed:', err);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerBackgroundTask = async () => {
  const status = await BackgroundFetch.getStatusAsync();
  console.log("Checking background fetch registration status:", status);

  if (
    status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
    status === BackgroundFetch.BackgroundFetchStatus.Denied
  ) {
    console.warn('Background fetch is not allowed');
    return;
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (!isRegistered) {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 300, // 5 minutes in seconds
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('Background task registered');
  }
};

