"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expo_server_sdk_1 = require("expo-server-sdk");
const DeviceTokenModel_1 = require("../models/DeviceTokenModel");
const expo = new expo_server_sdk_1.default();
exports.sendPushNotification = async ({ user_id, title, body, payload = {} }) => {
    const tokens = await DeviceTokenModel_1.default.find(user_id ? { user_id } : undefined);
    if (tokens.length < 1) {
        return;
    }
    const messages = [];
    for (let pushToken of tokens) {
        if (!expo_server_sdk_1.default.isExpoPushToken(pushToken.token)) {
            console.error(`Push token ${pushToken.token} is not a valid Expo push token`);
            continue;
        }
        messages.push({
            ttl: 5,
            to: pushToken.token,
            sound: "default",
            body,
            title,
            data: payload
        });
    }
    const chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
        try {
            await expo.sendPushNotificationsAsync(chunk);
        }
        catch (error) {
            console.error(error);
        }
    }
};
//# sourceMappingURL=Notifications.js.map