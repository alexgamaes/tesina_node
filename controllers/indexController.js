
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

  query = N1qlQuery.fromString('SELECT * from staging WHERE v IS NOT MISSING');
  bucket.query(query, function(err, rows, meta) {
	console.log(err);
        var s = "Data(" + rows.length + "): " + JSON.stringify(rows);
        var n = 0;

        for(row in rows) {
          console.log(rows[row].staging.v);
          n = (n + rows[row].staging.v) % 1000000007;
        }

        s = '<p>Checksum: ' + n + '</p><p>' + s + '</p>';

	       res.send(s);
    });

    //res.send('NOT IMPLEMENTED: View database');
};

exports.modify_database = function(req, res) {
var couchbase = require('couchbase')

    var cluster = new couchbase.Cluster('couchbase://localhost/');
    cluster.authenticate('sync_gateway', 'tesina');
    var bucket = cluster.openBucket('staging');
    bucket.operationTimeout=500*1000;

    var docs_number = req.params.docs_number;

    /*var N1qlQuery = couchbase.N1qlQuery;

    query = N1qlQuery.fromString('SELECT * from staging');/
    bucket.query(query, function(err, rows, meta) {*/
	  //console.log(err);
      var percentage = req.params.percentage;
      if(percentage == 0) {
        return res.send("CHANGED: " + percentage + "%");
      }
      var step = 100.0 / percentage;

      if(step == 0) {
        return res.send("INVALID STEP: " + percentage + "%");
      }

      for(let i = 0.0; Math.round(i) < docs_number; i += step) {
        bucket.replace("id" + Math.round(i), {
          'v': getRandomInt(10000000) + 1
        }, {},
        function (err, result) {
          console.log("change in: " + "id" + Math.round(i));
          console.log(err);

          if(Math.round(i + step) >= docs_number) {
            return res.send("FINISHED!");
          }
        });
      }

  //});
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
