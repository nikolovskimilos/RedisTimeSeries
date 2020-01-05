
const RedisMock = require('./__mocks__/redis');

const { commands, keywords } = require('../src/constants');
const RedisTimeSeries = require('../src/RedisTimeSeries');


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
	uncompressed: true
};

let rts = null;


describe('alter method tests', () => {
	beforeEach(() => {
    jest.clearAllMocks();
    
    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);
  });

  it('should alter time series', async () => {
  	const { key } = TEST_PARAMS;
  	const query = `${commands.TS_ALTER} ${TEST_PARAMS.key}`;

		await rts.alter(key);

		const redisCommandParams = RedisMock.send_command.mock.calls[0];
		expect(redisCommandParams.join(SIGN_SPACE)).toBe(query);
  });

	it('should alter time series with retention', async () => {
		const { key, retention } = TEST_PARAMS;
		const { RETENTION } = keywords;
  	const query = `${commands.TS_ALTER} ${key} ${RETENTION} ${retention}`;

		await rts.alter(key, { retention });

		const redisCommandParams = RedisMock.send_command.mock.calls[0];
		expect(redisCommandParams.join(SIGN_SPACE)).toBe(query);
  });

  it('should alter time series with labels', async () => {
  	const { key, labels } = TEST_PARAMS;
  	const query = `${commands.TS_ALTER} ${key} ${keywords.LABELS} room ${labels.room} section ${labels.section}`;

		await rts.alter(key, { labels });

		const redisCommandParams = RedisMock.send_command.mock.calls[0];
		expect(redisCommandParams.join(SIGN_SPACE)).toBe(query);
  });

  it('should create time series with retention and labels', async () => {
		const { key, retention, labels } = TEST_PARAMS;
		const { RETENTION, LABELS } = keywords;
  	const query = `${commands.TS_ALTER} ${key} ${RETENTION} ${retention} ${LABELS} room ${labels.room} section ${labels.section}`;

		await rts.alter(key, { retention, labels });

		const redisCommandParams = RedisMock.send_command.mock.calls[0];
		expect(redisCommandParams.join(SIGN_SPACE)).toBe(query);
  });

  it('should throw an error, key is missing', async () => {
		await expect(rts.alter()).rejects.toThrow();
  });

  it('should throw an error, key is not string', async () => {
		await expect(rts.alter(TEST_PARAMS.uncompressed)).rejects.toThrow();
  });

  it('should throw an error, retention is not valid', async () => {
		await expect(rts.alter(TEST_PARAMS.uncompressed, { retention: TEST_PARAMS.key })).rejects.toThrow();
  });

});