const QuerySchema = require('../QuerySchema');
const { Validator } = require('./utils');

const { retention, labels, timestamp, uncompressed } = require('./fragments');

const TS_INCRBY = 'TS.INCRBY';

/**
 * TS.INCRBY key value [TIMESTAMP timestamp] [RETENTION retentionTime] [UNCOMPRESSED] [LABELS field value..]
 */
module.exports = QuerySchema
  .create(TS_INCRBY)
  .data({ executable: true })
  .methodName('incrBy')
  .param(
    'key',
    (value) => !Validator.isUndefined(value) && Validator.isString(value)
  )
  .param(
    'value',
    (value) => !Validator.isUndefined(value) && Validator.isFloat(value)
  )
  .subquery(retention)
  .subquery(timestamp)
  .subquery(uncompressed)
  .subquery(labels);
