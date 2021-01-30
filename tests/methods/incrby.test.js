const { commands, keywords } = require('../constants');
const RedisTimeSeries = require('../../index');

const { TIMESTAMP, RETENTION, LABELS } = keywords;
const { TS_INCRBY } = commands;
const SIGN_SPACE = ' ';

const TEST_OPTIONS = {
  host: 'localhost',
  port: 6379
};
const TEST_PARAMS = {
  key: 'sometestkey',
  retention: 60,
  labels: {
    room: 'livingroom',
    section: 2
  },
  value: 17.4,
  timestamp: Date.now()
};

let rts = null;
let labelsQuery = null;

const validateQuery = (query) => {
  const [command, params] = rts.client.send_command.mock.calls[0];
  expect([command, ...params].join(SIGN_SPACE)).toBe(query.join(SIGN_SPACE));

  const { labels } = TEST_PARAMS;
  labelsQuery = [LABELS, 'room', labels.room, 'section', labels.section];
};

describe('incrBy method tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);
  });

  it('should increment the latest value of time series', async () => {
    const { key, value } = TEST_PARAMS;
    const query = [TS_INCRBY, key, value];

    await rts.incrBy(key, value).send();
    validateQuery(query);
  });

  it('should increment the latest value of time series with timestamp', async () => {
    const { key, value, timestamp } = TEST_PARAMS;
    const query = [TS_INCRBY, key, value, TIMESTAMP, timestamp];

    await rts.incrBy(key, value).timestamp(timestamp).send();
    validateQuery(query);
  });

  it('should increment the latest value of time series with retention', async () => {
    const { key, value, retention } = TEST_PARAMS;
    const query = [TS_INCRBY, key, value, RETENTION, retention];

    await rts.incrBy(key, value).retention(retention).send();
    validateQuery(query);
  });

  it('should increment the latest value of time series with labels', async () => {
    const { key, value, labels } = TEST_PARAMS;
    const query = [TS_INCRBY, key, value, ...labelsQuery];

    await rts.incrBy(key, value).labels(labels).send();
    validateQuery(query);
  });

  it('should throw an error, no arguments', async () => {
    await expect(rts.incrBy().send()).rejects.toThrow();
  });

  it('should throw an error, value is missing', async () => {
    await expect(rts.incrBy(TEST_PARAMS.key).send()).rejects.toThrow();
  });

  it('should throw an error, value is not valid', async () => {
    await expect(rts.incrBy(TEST_PARAMS.key, TEST_PARAMS.key).send()).rejects.toThrow();
  });
});
