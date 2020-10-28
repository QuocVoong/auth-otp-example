const getCounter = (
  timestamp,
  T0,
  Tx
) => {
  const adjustedTimestamp = timestamp - T0;
  const remainingTime = Tx - (adjustedTimestamp % Tx);
  const counter = Math.floor(adjustedTimestamp / Tx);
  const counterBuffer = Buffer.alloc(8, 0);
  counterBuffer.writeUInt32BE(counter, 4);
  return { counterBuffer, remainingTime };
};

module.exports = {
  getCounter
}