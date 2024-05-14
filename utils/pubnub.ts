import PubNub from 'pubnub';
import { v4 as uuidv4 } from 'uuid';

const pubnub = new PubNub({
  publishKey: process.env.NEXT_PUBLIC_PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.NEXT_PUBLIC_PUBNUB_SUBSCRIBE_KEY as string,
  uuid: uuidv4(),
});

export default pubnub;