import { DWClient, TOPIC_ROBOT } from '../dist/index.mjs';
import axios from 'axios';
import config from './config.json' assert { type: 'json' };

const client = new DWClient({
  clientId: config.appKey,
  clientSecret: config.appSecret,
});
client.registerCallbackListener(TOPIC_ROBOT, async (res) => {
    // 注册机器人回调事件
    console.log("收到消息");
    // const {messageId} = res.headers;
    const { text, senderStaffId, sessionWebhook } = JSON.parse(res.data);
    const body = {
      at: {
        atUserIds: [senderStaffId],
        isAtAll: false,
      },
      text: {
        content: 'nodejs-getting-started say : 收到，' + text?.content || '钉钉,让进步发生',
      },
      msgtype: 'text',
    };

    const result = await axios({
      url: sessionWebhook,
      method: 'POST',
      responseType: 'json',
      data: body,
      headers: {
        'x-acs-dingtalk-access-token': client.getConfig().access_token,
      },
    });

    return result.data;

    //client.send(messageId, body);
    return { success: true, code: 200, message: "OK", data: body };
  })
  .connect();
