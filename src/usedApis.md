# Fixed Report List

### Summary Fixed Part.
Total amount of COx in the last year. -> Number Only
Total amount of SOx in the last year. -> Number Only

Total amount of NOx in the last year. (Internal, Suppliers). -> Pie Chart
Total amount of PM2_5 in the last year. (Internal, Suppliers). -> Pie Chart
Total amount of PM10 in the last year. (Internal, Suppliers). -> Pie Chart

### Limited Custom Report Part (Auto create chart)
choose date range (begin ~ end)
choose category (pollutants || waste)
choose item ([SOx, NOx, COx, PM2_5, PM10] || [garbage, bildge, sludge])
choose chart type (barChart || lineChart)

<!-- Total amount of PM2_5 in the last year.
Total amount of PM10 in the last year.
Total waste of bildge in the last year.
Total waste of sludge in the last year.
Total waste of garbage in the last year.

(Internal Only)
Total amount of COx in the last year.
Total amount of SOx in the last year.
Total amount of NOx in the last year.
Total amount of PM2_5 in the last year.
Total amount of PM10 in the last year.
Total waste of bildge in the last year.
Total waste of sludge in the last year.
Total waste of garbage in the last year.

(SUppliers assigned Only) [separate by supplier]
Total amount of COx in the last year.
Total amount of SOx in the last year.
Total amount of NOx in the last year.
Total amount of PM2_5 in the last year.
Total amount of PM10 in the last year.
Total waste of bildge in the last year.
Total waste of sludge in the last year.
Total waste of garbage in the last year. -->




# frontend request apis

Reports (POST)

[payload]
timeframe: frequency ('day', 'week', 'month');
fetch: assign ('all', 'none', 'all', 'assigned'); // not contruct already
type: 0; Pollutants: 0 = all, 1 = fuel, 2 = utilities, 3 = Personnel travel
companyIds: [1, 2]
search: ```time>beginDate and time<endDate```


## Pollutants
url: /report/pollutants

search: ```time>beginDate and time<endDate``` || asset.id=1

## Waste
url: /report/waste

type wasteType enum(1, 2, 3);
search: wasteType ```time>beginDate and time<endDate AND type:0 OR type:1```



## Summarys

### all data of reports
/report/pollutatns/all/month/?reportCompanyIds=[1]&search=time>'1 year ago' and time<'today'
/report/waste/all/month/?reportCompanyIds=[1]&search=type:1 OR type:2 OR type:3 AND time>'1 year ago' and time<'today'

### internal data of reports
/report/pollutatns/none/month/?reportCompanyIds=[1]&search=time>'1 year ago' and time<'today'
/report/waste/none/month/?reportCompanyIds=[1]&search=type:1 OR type:2 OR type:3 AND time>'1 year ago' and time<'today'

### Assigned data of reports
/report/pollutatns/none/month/?reportCompanyIds=[2, ...]&search=time>'1 year ago' and time<'today'
/report/waste/none/month/?reportCompanyIds=[2, ...]&search=type:1 OR type:2 OR type:3 AND time>'1 year ago' and time<'today'