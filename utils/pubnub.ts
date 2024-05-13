// pubnub.js

import PubNub from 'pubnub';

const pubnub = new PubNub({
  publishKey: process.env.NEXT_PUBLIC_PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.NEXT_PUBLIC_PUBNUB_SUBSCRIBE_KEY,
  uuid: "yourUniqueUserId" // Unique identifier for each user
});

export default pubnub;