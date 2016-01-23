// Ratio tests - we calculate ratio, but based on the last (max) value of another column/field
describe('Reductio ratio based on column (Last)', function() {
  var group;

  beforeEach(function() {
    var data = crossfilter([{
      event: {
        zoneId: 'zone1',
        questionId: 'zone1-1-1',
        correct: true,
        segmentId: 1,
        completedOn: 10
      }
    }, {
      event: {
        zoneId: 'zone1',
        questionId: 'zone1-2-1',
        correct: true,
        segmentId: 2,
        completedOn: 11
      }
    }, {
      event: {
        zoneId: 'zone1',
        questionId: 'zone1-2-2',
        correct: false,
        segmentId: 2,
        completedOn: 12
      }
    }, {
      event: {
        zoneId: 'zone2',
        questionId: 'zone12-1-1',
        correct: true,
        segmentId: 1,
        completedOn: 10
      }
    }, {
      event: {
        zoneId: 'zone2',
        questionId: 'zone2-1-2',
        correct: false,
        segmentId: 1,
        completedOn: 10
      }
    }, {
      event: {
        zoneId: 'zone2',
        questionId: 'zone2-1-3',
        correct: undefined,
        segmentId: 1,
        completedOn: 10
      }
    }, {
      event: {
        zoneId: 'zone2',
        questionId: 'zone2-1-4',
        correct: false,
        segmentId: 1,
        completedOn: 15
      }
    }]);

    var dim = data.dimension(function(d) {
      return d.event.zoneId;
    });
    group = dim.group();

    // reducer definition is ratio(evaluate, field, fieldValueforNumerator, fieldForLatest, fieldForSort)
    var reducer = reductio().ratioBoCLatest(true, 'event.correct', true, 'event.segmentId', 'event.completedOn');

    reducer(group);

    // VARIANT: fieldForLatest same as fieldForSort
    var dim2 = data.dimension(function(d) {
      return d.event.zoneId;
    });
    group2 = dim2.group();

    // reducer definition is ratio(evaluate, field, fieldValueforNumerator, fieldForLatest, fieldForSort)
    var reducer2 = reductio().ratioBoCLatest(true, 'event.correct', true, 'event.segmentId', 'event.segmentId');

    reducer2(group2);
  });

  it('has three groups', function() {
    expect(group.top(Infinity).length).toEqual(2);
  });

  it('grouping has the right ratio', function() {
    var values = {};
    group.top(Infinity).forEach(function(d) {
      values[d.key] = d.value;
    });

    // console.log("ratioBoCLatest: values = %o", JSON.stringify(values));

    expect(values['zone1'].ratioBoCLatest).toEqual(0.5);
    expect(values['zone2'].ratioBoCLatest).toEqual(0.25);
  });

  // VARIANT expectations
  it('(VARIANT) has three groups', function() {
    expect(group2.top(Infinity).length).toEqual(2);
  });

  it('(VARIANT) grouping has the right ratio', function() {
    values = {};
    group2.top(Infinity).forEach(function(d) {
      values[d.key] = d.value;
    });

    // console.log("(VARIANT) ratioBoCLatest: values = %o", JSON.stringify(values));

    expect(values['zone1'].ratioBoCLatest).toEqual(0.5);
    expect(values['zone2'].ratioBoCLatest).toEqual(0.25);
  });
});
