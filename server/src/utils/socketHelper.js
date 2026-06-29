export const emitSocketEvent = (socketId, event, data) => {
  console.log(`[Socket.io Mock] Emitting event "${event}" to socket "${socketId}" with data:`, data);
  return true;
};

export default {
  emitSocketEvent
};
