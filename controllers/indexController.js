
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Display list of all Authors.
exports.create_database = function(req, res) {
  var couchbase = require('couchbase');
    var cluster = new couchbase.Cluster('couchbase://localhost/');
    cluster.authenticate('sync_gateway', 'tesina');
    var bucket = cluster.openBucket('staging');

    bucket.operationTimeout=500*1000;

      for(let i = 0; i < req.params.docs_number; i++) {
        bucket.upsert("id" + i, {
          'v': getRandomInt(10000000) + 1
        },
        function (err, result) {
          console.log(i);
          console.log(err);
          console.log(result);
           if(i == req.params.docs_number - 1) {
             res.send("FINISHED");
           }
          });

        for(var j = 0; j < 100000; j++) {
          var z = j + 4;
        }
      }
};

exports.view_database = function(req, res) {
var couchbase = require('couchbase')

    var cluster = new couchbase.Cluster('couchbase://localhost/');
    cluster.authenticate('sync_gateway', 'tesina');
    var bucket = cluster.openBucket('staging');

    var N1qlQuery = couchbase.N1qlQuery;

    query = N1qlQuery.fromString('SELECT * from staging');
    bucket.query(query, function(err, rows, meta) {
	console.log(err);
        var s = "LOL: (" + rows.length + ")" + JSON.stringify(rows);

	res.send(s);
    });

    //res.send('NOT IMPLEMENTED: View database');
};

exports.delete_database = function(req, res) {
    var couchbase = require('couchbase')

    var cluster = new couchbase.Cluster('couchbase://localhost/');
    cluster.authenticate('sync_gateway', 'tesina');
    var bucket = cluster.openBucket('staging');

    var bucketMgr = bucket.manager();
    bucketMgr.flush(function(err, status) {
    if (status) {
       res.send('Bucket flushed');
    } else {
	console.log(err);
       res.send('Could not flush bucket: ');
    }
});
};
