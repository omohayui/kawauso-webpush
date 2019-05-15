/**
 * firebase-messaging-sw.js
 * Kawauso WebPush (c)omohayui
 */
importScripts('https://www.gstatic.com/firebasejs/5.11.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.11.1/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': 'YOUR FCM SENDER ID'
});

const messaging = firebase.messaging();

// メッセージ受信 for Background
messaging.setBackgroundMessageHandler(function(payload) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
});
