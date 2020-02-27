#!/bin/sh

snapshotPath=".travis/check-strict-null-errors.snapshot"

snapshot=`cat $snapshotPath` 
calculated=`tsc --noEmit --strictNullChecks | node scripts/count-strict-null-check-errors.js` 
master=`curl -s -f https://raw.githubusercontent.com/mirumee/saleor-dashboard/master/$snapshotPath`

diffCalculatedAndSnapshot=`echo "$calculated" | diff --strip-trailing-cr $snapshotPath - | wc -w`

if [ $diffCalculatedAndSnapshot -gt 0 ]
then
    echo ERROR: Outdated snapshot found. Run \"npm run check-strict-null-errors -- -u\" to update it.
    exit 1
fi

errorsBefore=`echo "$master" | wc -l`
errorsAfter=`echo "$snapshot" | wc -l`

diff=`echo "$master" | diff $snapshotPath -`
resolved=`echo "$diff" | grep -e ^\>`
resolvedNum=`echo -n "$resolved" | wc -l`
added=`echo "$diff" | grep -e ^\<`
addedNum=`echo -n "$added" | wc -l`

if [ `echo "$resolved" | wc -w` -eq 0 ]
then
    resolvedNum=0
fi

if [ `echo "$added" | wc -w` -eq 0 ]
then
    addedNum=0
fi

echo Resolved errors: $resolvedNum. Introduced errors: $addedNum.

if [ $addedNum -gt 0 ]
then
    echo ERROR: Introduced new $addedNum errors. Fix them before merge.
    echo "\n$added"
    exit 1
else 
    if [ $errorsBefore -eq $errorsAfter ]
    then
        echo Number of errors has not changed.
    else
        echo Number of errors decreased from $errorsBefore to $errorsAfter.
    fi
fi



exit 0
