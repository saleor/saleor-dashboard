#!/bin/sh

snapshot=`cat .travis/check-strict-null-errors.snapshot` 
calculated=`tsc --noEmit --strictNullChecks | node scripts/count-strict-null-check-errors.js` 
master=`curl -s -f https://raw.githubusercontent.com/mirumee/saleor-dashboard/master/.travis/check-strict-null-errors.snapshot`

if [ $calculated -ne $snapshot ]
then
    echo ERROR: Outdated snapshot found. Before: $snapshot, now: $calculated errors.
    exit 1
fi

if [ $calculated -gt $master ]
then
    echo ERROR: Number of errors increased from $master to $calculated.
    exit 1
fi

exit 0