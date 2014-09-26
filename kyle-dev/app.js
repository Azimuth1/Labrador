
d3.csv('rawdata/alllabs.lab', function(d) {
    data = d;
});


geo= _.chain(data)
    .groupBy('Station Name')
    .map(function(d, name) {
        var comp = _.groupBy(d, 'Compound');
        var count = _.map(comp, function(e, compound) {
            var seperateCompounds = _.keys(_.groupBy(e,
                'Sample Matrix'));
            var val = _.reduce(e, function(memo, num) {
                return memo + +num.Value;
            }, 0);
            var test = {};
            _.each(seperateCompounds, function(uniqCom) {
                var soil = _.chain(e)
                    .filter(function(obj) {
                        return obj['Sample Matrix'] == uniqCom;
                    })
                    .value();
                soil = _.reduce(soil, function(memo,
                    num) {
                    return memo + +num.Value;
                }, 0);
                test[uniqCom] = soil;
            });
            var obj = {};
            obj.compound = compound;
            obj.all = val;
            _.each(test, function(val, key) {
                obj[key] = val;
            });
            return obj;
        });
        return {
            name: name,
            Compounds: count,
        };
    })
    .value();


    var range = function(min,max){
        return data.filter(function(d){
            return min>=+data[0]['Samp.Top'] <=max
        })
    }