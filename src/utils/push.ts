import { Expo, ExpoPushTicket, ExpoPushReceipt } from 'expo-server-sdk';

// Create a new Expo SDK client
const iexpo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
  useFcmV1: true,
});

export const sendMessage = async (messages: any) => {
  try {
    let newMessages: any[] = [];

    let somePushTokens = [
      'ExponentPushToken[IDkakXEPDXCy-NU-SmBs13]',
      'ExponentPushToken[_ednsVAJQk7JnpfF3wTIxC]',
      'ExponentPushToken[JD5Zz-MxGFOz32gTQ9d8BS]'
    ];

    for (let pushToken of somePushTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Invalid Expo push token: ${pushToken}`);
        continue;
      }
    }

    let allMessages = [...messages, ...newMessages];

    let chunks = iexpo.chunkPushNotifications(allMessages);
    let tickets: ExpoPushTicket[] = [];

    for (let chunk of chunks) {
      try {
        let ticketChunk = await iexpo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending notifications:', error);
        return { error };
      }
    }

    let receiptIds: string[] = tickets
      .filter((ticket) => ticket.status === 'ok' && 'id' in ticket)
      .map((ticket) => (ticket as any).id as string); // Cast to 'any' to avoid TS error

    if (receiptIds.length > 0) {
      await checkReceipts(receiptIds);
    }

    return { response: tickets };
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return { error };
  }
};

// Function to check push notification receipts
const checkReceipts = async (receiptIds: string[]) => {
  let receiptIdChunks = iexpo.chunkPushNotificationReceiptIds(receiptIds);

  for (let chunk of receiptIdChunks) {
    try {
      let receipts: { [id: string]: ExpoPushReceipt } =
        await iexpo.getPushNotificationReceiptsAsync(chunk);

      for (let receiptId in receipts) {
        let receipt = receipts[receiptId];
        if (receipt.status === 'error') {
          console.error(
            `Error sending notification (ID: ${receiptId}): ${receipt.details?.error || 'Unknown error'}`
          );
        }
      }
    } catch (error) {
      console.error('Error fetching receipts:', error);
    }
  }
};
