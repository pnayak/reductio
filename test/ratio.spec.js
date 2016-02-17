// Ratio tests
describe('Reductio ratio', function() {
  var group;

  beforeEach(function() {
    var data = crossfilter([{
      event: {
        zoneId: 'zone1',
        questionId: 11,
        correct: true,
        segmentId: 1
      }
    }, {
      event: {
        zoneId: 'zone1',
        questionId: 12,
        correct: false,
        segmentId: 2
      }
    }, {
      event: {
        zoneId: 'zone2',
        questionId: 21,
        correct: true,
        segmentId: 2
      }
    }, {
      event: {
        zoneId: 'zone3',
        questionId: 21,
        correct: undefined,
        segmentId: 2
      }
    }, {
      event: {
        zoneId: 'zone3',
        questionId: 22,
        correct: false,
        segmentId: 2
      }
    }, {
      event: {
        zoneId: 'zone3',
        questionId: 23,
        // correct: false,
        segmentId: 2
      }
    }]);

    var dim = data.dimension(function(d) {
      return d.event.zoneId;
    });
    group = dim.group();

    // reducer definition is ratio(evaluate, field, fieldValueforNumerator)
    var reducer = reductio().ratio(true, 'event.correct', true);

    reducer(group);
  });

  it('has three groups', function() {
    expect(group.top(Infinity).length).toEqual(3);
  });

  it('grouping has the right ratio', function() {
    var values = {};
    group.top(Infinity).forEach(function(d) {
      values[d.key] = d.value;
    });

    // console.log("values = %o", values['zone1']);

    expect(values['zone1'].ratio).toEqual(0.5);
    expect(values['zone2'].ratio).toEqual(1.0);
    expect(values['zone3'].ratio).toEqual(0.0);

  });
});
