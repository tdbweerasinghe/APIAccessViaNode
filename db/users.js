var records = [
    { id: 1, username: 'man', password: 'pwd', displayName: 'Sample Man', emails: [ { value: 'man@someone.com' } ] }
  , { id: 2, username: 'woman', password: 'pwd', displayName: 'Sample Man', emails: [ { value: 'woman@someone.com' } ] }
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
