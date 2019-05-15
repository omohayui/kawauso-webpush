/**
 * main.js
 * Kawauso WebPush (c)omohayui
 */
const messaging = firebase.messaging();
const messageElement = document.getElementById('message');
const tokenElement = document.getElementById('token');

// FCM用公開鍵の登録
messaging.usePublicVapidKey("YOUER FCM PUBLIC KEY");

// ServiceWorkerの登録
navigator.serviceWorker.register('./firebase-messaging-sw.js').then((registration) => {
  messaging.useServiceWorker(registration);
});

// 受信許可のリクエスト
const requestPermission = () => {
  messaging.requestPermission().then(() => {
    // 登録されたTokenの取得
    messaging.getToken().then((token) => {
      // TODO: Token保存リクエストをサーバーへ送る
      messageElement.value = '通知設定が許可されました！';
      tokenElement.value = token;
    }).catch((err) => {
      messageElement.value = '通知設定に失敗しました。: ' + err;
    });
  }).catch((err) => {
    messageElement.value = '通知が許可されませんでした。: ' + err;
  });
}

window.onload = () => {
  // 対応ブラウザかどうか
  if (!("Notification" in window)) {
    messageElement.value = '通知機能が対応されていないブラウザです。';
    return;
  }
  // TODO: Tokenの更新チェック

  // Token取得
  messaging.getToken().then((currentToken) => {
    if (currentToken && Notification.permission === "granted") {
      messageElement.value = '通知設定はONです。';
      tokenElement.value = currentToken;
    } else {
      // Tokenが登録されていない or 通知が許可されていない場合
      messageElement.value = '通知設定が登録されていません。通知を許可してください。';
      requestPermission();
    }
  }).catch((err) => {
    // TODO: blocked の場合は Token削除のリクエストをサーバーへ送る
    messageElement.value = '通知設定に失敗しました。: ' + err;
  });
  // メッセージ受信 for Foreground
  messaging.onMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.icon,
    };
    const notification = new Notification(notificationTitle, notificationOptions);
  });
};
